import json
import time
import logging
import psycopg2
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
from pydantic_settings import BaseSettings, SettingsConfigDict
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type


logger = logging.getLogger()
logger.setLevel(logging.INFO)

class Settings(BaseSettings):
    database_url: str 
    request_delay: float = 1.0 
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

def get_db_connection():
    try:
        return psycopg2.connect(settings.database_url)
    except psycopg2.OperationalError as e:
        logger.critical(f"Database connection failed: {e}")
        raise e

@retry(
    stop=stop_after_attempt(3), 
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type((GeocoderTimedOut, GeocoderServiceError)),
    reraise=True
)
def get_lat_long(geolocator, address):
    """
    Attempts to geocode address. Retries on network/timeout errors.
    Returns location object or raises exception after retries.
    """
    return geolocator.geocode(address, timeout=10)

def fetch_raw_leads():
    """
    Placeholder for future Selenium/Requests scraping logic.
    """
    return [
        {"name": "Dairy King Estate", "address": "Irene Dairy Farm, Pretoria, South Africa", "products": ["Milk"], "phone": "012-000-1111"},
        {"name": "Centurion Egg Depot", "address": "Rooihuiskraal, Centurion, South Africa", "products": ["Eggs"], "phone": "012-666-7777"},
        {"name": "Bad Address Farm", "address": "Nowhere, Mars", "products": ["Space Dust"], "phone": "000-000-0000"}, # Test case for geocoding failure
    ]

def lambda_handler(event, context):
    logger.info("--- Starting Scraper Job ---")
    
    conn = None
    stats = {"added": 0, "skipped": 0, "errors": 0}

    try:
        conn = get_db_connection()
        conn.autocommit = True
        cursor = conn.cursor()
        
        geolocator = Nominatim(user_agent="plaasstop_scraper_lambda")
        raw_leads = fetch_raw_leads()

        for lead in raw_leads:
            try:
                # 1. Check for duplicates
                cursor.execute("SELECT id FROM farms WHERE name = %s", (lead["name"],))
                if cursor.fetchone():
                    logger.info(f"[SKIP] Duplicate: {lead['name']}")
                    stats["skipped"] += 1
                    continue

                location = None
                try:
                    location = get_lat_long(geolocator, lead["address"])
                except Exception as geo_err:
                    logger.warning(f"[GEO FAIL] Could not geocode {lead['name']}: {geo_err}")
                    stats["errors"] += 1
                    continue

                if not location:
                    logger.warning(f"[GEO NULL] Address found but no location data: {lead['name']}")
                    stats["errors"] += 1
                    continue

                query = """
                    INSERT INTO farms (name, type, status, products, contact, location)
                    VALUES (%s, 'lead', 'unclaimed', %s, %s, ST_GeomFromText(%s, 4326))
                """
                point_str = f"POINT({location.longitude} {location.latitude})"
                
                cursor.execute(query, (
                    lead["name"], 
                    lead["products"], 
                    json.dumps({"phone": lead["phone"], "address": lead["address"]}),
                    point_str
                ))
                
                logger.info(f"[ADDED] {lead['name']}")
                stats["added"] += 1
                
                time.sleep(settings.request_delay) 

            except Exception as row_err:
                logger.error(f"[ROW ERROR] Failed processing {lead.get('name', 'Unknown')}", exc_info=True)
                stats["errors"] += 1

        cursor.close()
        
    except Exception as e:
        logger.critical("Critical script failure", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps(f"Critical Error: {str(e)}")
        }
    finally:
        if conn:
            conn.close()
    
    logger.info(f"Job Complete. Stats: {json.dumps(stats)}")
    
    return {
        'statusCode': 200,
        'body': json.dumps(stats)
    }

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    lambda_handler(None, None)