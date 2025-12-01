import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException 
from bs4 import BeautifulSoup # <--- INI ADALAH BARIS YANG HILANG ATAU TERHAPUS!
import time
import sys
import io

# Menggunakan ID yang Dikonfirmasi
NEXT_BUTTON_ID = "table-kbli_next" 
MAX_PAGINATION_ATTEMPTS = 3 

def scrape_kbli_with_selenium(url):
    """
    Mengambil SEMUA data KBLI menggunakan Selenium dengan perulangan halaman (pagination)
    dan mekanisme retry untuk mengatasi StaleElementReferenceException.
    """
    
    print("Mengatur Chrome Driver...")
    
    try:
        service = ChromeService(ChromeDriverManager().install())
        
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        
        driver = webdriver.Chrome(service=service, options=options)
        
    except Exception as e:
        print(f"Gagal mengatur atau memulai Chrome Driver: {e}", file=sys.stderr)
        return []

    print(f"Mengakses URL: {url} dan memulai scraping...")
    
    all_data_list = []
    page_num = 1
    
    try:
        driver.get(url)

        # 2. Perulangan utama untuk memuat semua halaman
        while True:
            print(f"\n--- Mengambil data dari Halaman {page_num} ---")
            
            # 3. Menunggu hingga data table siap dimuat dan loading indicator hilang
            try:
                WebDriverWait(driver, 20).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "#table-kbli tbody tr:first-child"))
                )
                WebDriverWait(driver, 10).until_not(
                    EC.text_to_be_present_in_element((By.ID, "table-kbli_info"), "processing")
                )
            except Exception:
                print("Time-out saat menunggu baris data baru dimuat. Mengakhiri perulangan.")
                break

            # 4. Ambil dan parse data dari halaman saat ini
            table_wrapper = driver.find_element(By.ID, "table-kbli_wrapper")
            
            # Pastikan BeautifulSoup sudah diimpor di atas
            soup = BeautifulSoup(table_wrapper.get_attribute('outerHTML'), 'html.parser')
            table = soup.find('table', id='table-kbli')
            
            rows = table.find('tbody').find_all('tr') if table and table.find('tbody') else []

            if not rows or (len(rows) == 1 and rows[0].find('td', class_='dataTables_empty')):
                print("Tabel kosong atau tidak ada data yang tersedia. Mengakhiri perulangan.")
                break

            print(f"Ditemukan {len(rows)} baris data KBLI di halaman ini.")
            
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 4:
                    all_data_list.append({
                        'Kode KBLI': cols[1].text.strip(),
                        'KBLI': cols[2].text.strip(),
                        'Deskripsi': cols[3].text.strip()
                    })

            # 5. Logika Pagination dengan Retry
            
            clicked_successfully = False
            for attempt in range(MAX_PAGINATION_ATTEMPTS):
                try:
                    # 5.1 Re-locate the button FRESH before every interaction
                    next_button = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, NEXT_BUTTON_ID))
                    )
                    
                    # 5.2 Check for disabled status
                    if 'disabled' in next_button.get_attribute('class'):
                        print("Tombol 'Next' dinonaktifkan. Semua data telah diambil.")
                        clicked_successfully = True 
                        break 

                    # 5.3 KLIK MENGGUNAKAN JAVASCRIPT EXECUTOR
                    driver.execute_script("arguments[0].click();", next_button)
                    
                    clicked_successfully = True
                    break 
                    
                except StaleElementReferenceException:
                    if attempt < MAX_PAGINATION_ATTEMPTS - 1:
                        print(f"[Percobaan {attempt + 1}/{MAX_PAGINATION_ATTEMPTS}] Referensi elemen 'Next' menjadi kadaluarsa (stale). Mencoba re-locate dan klik lagi...")
                        time.sleep(1)
                        continue 
                    else:
                        raise 

            # 6. Lanjutkan atau Hentikan
            if not clicked_successfully:
                break
            
            # Cek status tombol lagi setelah klik/retry loop
            next_button_check = driver.find_element(By.ID, NEXT_BUTTON_ID)
            if 'disabled' in next_button_check.get_attribute('class'):
                break

            # Jika berhasil diklik dan tombol tidak disabled
            page_num += 1
            print(f"Menunggu 3 detik untuk memuat Halaman {page_num}...")
            time.sleep(3) 

        # Selesai perulangan
        if all_data_list:
            return pd.DataFrame(all_data_list)
        else:
            return []

    except Exception as e:
        print(f"Terjadi error saat scraping di halaman {page_num}: {e}", file=sys.stderr)
        return []
        
    finally:
        driver.quit()
        print("\nBrowser ditutup.")

# --- Eksekusi Skrip Utama ---
if __name__ == "__main__":
    KBLI_URL = "https://legalitas.org/kbli"
    
    df_kbli = scrape_kbli_with_selenium(KBLI_URL)
    
    if isinstance(df_kbli, pd.DataFrame) and not df_kbli.empty:
        # Menyimpan data ke file JSON
        output_file = "kbli_data_scraped_full.json"
        
        df_kbli.to_json(output_file, orient='records', indent=4, force_ascii=False)
        
        print("\n--- ✅ Hasil Sukses ---")
        print(f"Total {len(df_kbli)} baris data KBLI berhasil disimpan ke {output_file}")
        print("\n5 baris data pertama (dalam DataFrame):")
        print(df_kbli.head())
    else:
        print("\n❌ Gagal mengambil data.")