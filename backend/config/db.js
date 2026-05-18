// Simple in-memory store — replace with MongoDB/PostgreSQL in production
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export const db = {
  products: [
    {
      id: '1',
      name: 'Essential Compression T-Shirt',
      nameAr: 'تيشيرت ضغط أساسي',
      price: 590,
      originalPrice: 750,
      discount: 21,
      category: 'compressions',
      gender: 'men',
      colors: ['#000000', '#1a3a5c', '#8B1a1a', '#1a3a2c', '#4a4a8a', '#b0b0b0'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600',
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600'
      ],
      description: 'Premium compression shirt for maximum performance',
      descriptionAr: 'تيشيرت ضغط ممتاز لأقصى أداء',
      rating: 4.5,
      reviews: 128,
      stock: 50,
      featured: true,
      badge: 'BUY 1 GET 1 FREE',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Washed Zipup Originals Hoodie',
      nameAr: 'هودي أوريجينالز زيب أب مغسول',
      price: 790,
      originalPrice: 790,
      discount: 0,
      category: 'hoodies',
      gender: 'men',
      colors: ['#2a2a2a', '#1a3a5c', '#4a2a2a'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600',
        'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600'
      ],
      description: 'Premium washed hoodie with signature Originals branding',
      descriptionAr: 'هودي واشد ممتاز مع شعار أوريجينالز المميز',
      rating: 4.2,
      reviews: 5,
      stock: 30,
      featured: true,
      badge: '',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Classic Running Shorts',
      nameAr: 'شورت جري كلاسيك',
      price: 320,
      originalPrice: 400,
      discount: 20,
      category: 'shorts',
      gender: 'men',
      colors: ['#000000', '#1a3a5c', '#2a4a2a'],
      sizes: ['S', 'M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600'
      ],
      description: 'Lightweight running shorts with built-in liner',
      descriptionAr: 'شورت جري خفيف الوزن مع بطانة داخلية',
      rating: 4.7,
      reviews: 89,
      stock: 45,
      featured: false,
      badge: '20% OFF',
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Women Compression Leggings',
      nameAr: 'ليجينز ضغط للنساء',
      price: 650,
      originalPrice: 820,
      discount: 21,
      category: 'compressions',
      gender: 'women',
      colors: ['#000000', '#1a1a4a', '#4a1a2a'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600'
      ],
      description: 'High-waist compression leggings for training and lifestyle',
      descriptionAr: 'ليجينز ضغط خصر عالي للتدريب والحياة اليومية',
      rating: 4.8,
      reviews: 203,
      stock: 60,
      featured: true,
      badge: '21% OFF',
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Sports Bra Performance',
      nameAr: 'حمالة صدر رياضية',
      price: 380,
      originalPrice: 380,
      discount: 0,
      category: 'sports-bra',
      gender: 'women',
      colors: ['#000000', '#c0a0a0', '#2a3a5a'],
      sizes: ['XS', 'S', 'M', 'L'],
      images: [
        'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600'
      ],
      description: 'High-support sports bra for intense workouts',
      descriptionAr: 'حمالة صدر رياضية عالية الدعم للتمارين المكثفة',
      rating: 4.6,
      reviews: 147,
      stock: 40,
      featured: false,
      badge: '',
      createdAt: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Oversized Graphic Tee',
      nameAr: 'تيشيرت اوفرسايز بطباعة',
      price: 450,
      originalPrice: 450,
      discount: 0,
      category: 'tshirts',
      gender: 'men',
      colors: ['#f5f0e8', '#000000', '#8B7355'],
      sizes: ['M', 'L', 'XL', 'XXL'],
      images: [
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'
      ],
      description: 'Relaxed oversized fit with vintage graphic print',
      descriptionAr: 'قصة أوفرسايز مريحة مع طباعة فنتاج',
      rating: 4.3,
      reviews: 62,
      stock: 35,
      featured: false,
      badge: 'NEW',
      createdAt: new Date().toISOString()
    }
  ],

  orders: [],

  users: [],

  async init() {
    const hashedPw = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 10);
    this.users.push({
      id: uuidv4(),
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@yourbrand.com',
      password: hashedPw,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    console.log('✅ DB initialized with admin user');
  }
};

db.init();
