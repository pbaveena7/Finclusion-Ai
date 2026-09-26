import csv
import random
import os
from datetime import datetime, timedelta

def generate_financial_dataset(filename, num_records):
    # Categories and base names
    categories = ['Equity', 'Debt', 'Hybrid', 'Index', 'Liquid', 'Government Scheme', 'ETF']
    risk_profiles = ['Low', 'Moderate', 'High', 'Very High']
    fund_houses = ['SBI', 'HDFC', 'ICICI', 'Aditya Birla', 'Kotak', 'Nippon', 'Axis', 'UTI', 'Tata', 'Mirae', 'Groww', 'Zerodha']
    themes = ['Bluechip', 'Midcap', 'Smallcap', 'Flexi Cap', 'Tech', 'Healthcare', 'Infrastructure', 'ESG', 'Banking']
    
    filepath = os.path.join(os.path.dirname(__file__), '..', 'data', filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    print(f"Generating {num_records} records to {filepath}...")
    
    with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['id', 'name', 'category', 'risk', 'nav', 'returns_1y', 'returns_3y', 'returns_5y', 'expense_ratio', 'aum_crores', 'launch_date']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        
        for i in range(1, num_records + 1):
            house = random.choice(fund_houses)
            theme = random.choice(themes)
            cat = random.choice(categories)
            
            # Generate realistic synthetic data based on category
            if cat == 'Equity':
                risk = random.choice(['High', 'Very High'])
                ret_1y = round(random.uniform(-5.0, 35.0), 2)
                ret_3y = round(random.uniform(8.0, 25.0), 2)
                ret_5y = round(random.uniform(10.0, 20.0), 2)
                exp_ratio = round(random.uniform(0.4, 2.0), 2)
            elif cat == 'Debt':
                risk = random.choice(['Low', 'Moderate'])
                ret_1y = round(random.uniform(4.0, 8.0), 2)
                ret_3y = round(random.uniform(5.0, 9.0), 2)
                ret_5y = round(random.uniform(6.0, 8.5), 2)
                exp_ratio = round(random.uniform(0.1, 0.8), 2)
            else:
                risk = random.choice(risk_profiles)
                ret_1y = round(random.uniform(2.0, 20.0), 2)
                ret_3y = round(random.uniform(4.0, 18.0), 2)
                ret_5y = round(random.uniform(5.0, 15.0), 2)
                exp_ratio = round(random.uniform(0.1, 1.5), 2)
                
            nav = round(random.uniform(10.0, 500.0), 2)
            aum = round(random.uniform(50.0, 50000.0), 2)
            
            # Random date within last 15 years
            days_ago = random.randint(365, 5400)
            launch = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')
            
            name = f"{house} {theme} {cat} Fund - Growth"
            if cat == 'Government Scheme':
                name = f"PM {theme} Scheme Series {random.randint(1, 100)}"
            
            writer.writerow({
                'id': f"FIN-{i:07d}",
                'name': name,
                'category': cat,
                'risk': risk,
                'nav': nav,
                'returns_1y': ret_1y,
                'returns_3y': ret_3y,
                'returns_5y': ret_5y,
                'expense_ratio': exp_ratio,
                'aum_crores': aum,
                'launch_date': launch
            })
            
            if i % 25000 == 0:
                print(f"Generated {i} records...")
                
    print(f"Dataset generated successfully! File size: {os.path.getsize(filepath) / (1024*1024):.2f} MB")

if __name__ == "__main__":
    generate_financial_dataset('finclusion_100k_dataset.csv', 100000)
