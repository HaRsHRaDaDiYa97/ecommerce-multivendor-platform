import os
import django

os.environ['DB_HOST'] = 'ep-billowing-king-axdb9929-pooler.c-4.us-east-2.aws.neon.tech'
os.environ['DB_NAME'] = 'neondb'
os.environ['DB_USER'] = 'neondb_owner'
os.environ['DB_PASSWORD'] = 'npg_soyU0AJqm6uT'
os.environ['DB_PORT'] = '5432'
os.environ['DB_SSLMODE'] = 'require'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product
from users.models import User
from stores.models import Store

print(f"Neon Products Count: {Product.objects.count()}")
print(f"Neon Users Count: {User.objects.count()}")
print(f"Neon Stores Count: {Store.objects.count()}")
