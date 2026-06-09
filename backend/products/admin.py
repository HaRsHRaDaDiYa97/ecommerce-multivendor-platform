from django.contrib import admin
from .models import Category, Product, ProductImage, Tag

class SubCategoryInline(admin.TabularInline):
    model = Category
    fk_name = "parent"
    extra = 1
    fields = ('name','slug','description')
    show_change_link = True

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id','name','parent','slug')
    prepopulated_fields = {"slug":("name",)}
    inlines = [SubCategoryInline]
    search_fields = ['name','description']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id','name','store','category','price','stock','created_at')
    list_filter = ('category','store','tags')
    search_fields = ('name','description','sku','store__name')
    readonly_fields = ('created_at',)
    filter_horizontal = ('tags',)

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('id','product','alt_text')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id','name','slug','is_active')
    prepopulated_fields = {"slug":("name",)}
    search_fields = ('name',)