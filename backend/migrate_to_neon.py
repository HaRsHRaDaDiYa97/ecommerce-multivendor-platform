import os
import django

# Set Neon DB Credentials
os.environ['DB_HOST'] = 'ep-billowing-king-axdb9929-pooler.c-4.us-east-2.aws.neon.tech'
os.environ['DB_NAME'] = 'neondb'
os.environ['DB_USER'] = 'neondb_owner'
os.environ['DB_PASSWORD'] = 'npg_soyU0AJqm6uT'
os.environ['DB_PORT'] = '5432'
os.environ['DB_SSLMODE'] = 'require'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.management import call_command
from products.models import Product
from users.models import User

def main():
    print("[1/2] Applying migrations on your Neon.tech cloud database...")
    call_command('migrate')

    print("[2/2] Transferring your 11 products, 9 users, stores & orders to Neon.tech...")
    call_command('loaddata', 'datadump_utf8.json')

    print("\nSUCCESS! DATA SHIFT COMPLETED TO NEON.TECH!")
    print(f"Total Products in Neon DB: {Product.objects.count()}")
    print(f"Total Users in Neon DB: {User.objects.count()}")

if __name__ == '__main__':
    main()
