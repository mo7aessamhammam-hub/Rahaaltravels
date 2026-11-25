import type { Lang } from '../types/i18n';

/**
 * Customer reviews. Add ONLY real reviews, copied exactly as the customer wrote them
 * (with their permission). Leave `review: null` to show a clearly marked placeholder card.
 * Never translate a review and present it as the customer's own words — set `lang`
 * to the language the customer actually wrote in.
 */
export type Testimonial = {
  id: string;
  name: string | null; // e.g. 'أحمد – القاهرة'
  service: string | null; // e.g. 'عمرة'
  rating: number | null; // real star rating, 1-5
  photo: string | null; // real photo URL with permission, or null for initials
  review: {text: string;lang: Lang;} | null;
};

// Photos are in place; fill in each customer's real name, service, rating and review.
const photo = (n: number) => `/testimonials/customer-${n}.webp`;

// Only entries with review text are shown on the site; empty ones stay hidden until filled. Add more below in the same shape
// (photos customer-2 … customer-10 are ready in public/testimonials/).
export const testimonials: Testimonial[] = [
  {
    id: 'customer-1',
    name: 'أحمد خالد – دبي',
    service: 'عمرة',
    rating: 5,
    photo: photo(1),
    review: { text: 'التعامل راقي أوي', lang: 'ar' }
  },
  {
    id: 'customer-2',
    name: 'سلمى أبو الهوا – طنطا',
    service: 'رحلة دهب',
    rating: 5,
    photo: photo(5),
    review: { text: 'الرحلة كانت منظمة جدًا والفندق على البحر زي الصور بالظبط، هنكرر التجربة أكيد', lang: 'ar' }
  },
  {
    id: 'customer-3',
    name: 'أمنية محمود – القاهرة',
    service: 'رحلة الغردقة',
    rating: 4,
    photo: photo(4),
    review: { text: 'كل حاجة زي ما الشركة قالت بالظبط، بصراحة تعامل محترم', lang: 'ar' }
  },
  {
    id: 'customer-4',
    name: 'محمد السيد – الإسكندرية',
    service: 'عمرة',
    rating: 5,
    photo: photo(3),
    review: { text: 'رحلة العمرة كانت مريحة جدًا، والمشرف كان متابع معانا في كل خطوة', lang: 'ar' }
  },
  {
    id: 'customer-5',
    name: 'مصطفى عادل – المنصورة',
    service: 'رحلة الأقصر وأسوان',
    rating: 5,
    photo: photo(6),
    review: { text: 'الحجز كان سهل والأسعار مناسبة جدًا مقارنة بالخدمة، شكرًا لكل الفريق', lang: 'ar' }
  },
  {
    id: 'customer-6',
    name: 'يوسف إبراهيم – الجيزة',
    service: 'رحلة الأقصر وأسوان',
    rating: 5,
    photo: photo(2),
    review: { text: 'برنامج الرحلة كان متظبط والمرشد شرحلنا كل حاجة بشكل جميل', lang: 'ar' }
  },
  {
    id: 'customer-7',
    name: 'حسام مصطفى – أبوظبي',
    service: 'عمرة',
    rating: 5,
    photo: photo(7),
    review: { text: 'ربنا يكرمكم، الإقامة كانت قريبة من الحرم والتنظيم ممتاز من أول يوم', lang: 'ar' }
  },
  {
    id: 'customer-8',
    name: 'كريم حسن – طنطا',
    service: 'رحلة مرسى علم',
    rating: 4,
    photo: photo(8),
    review: { text: 'رحلة حلوة وخدمة كويسة، والرد على الاستفسارات كان سريع', lang: 'ar' }
  },
  {
    id: 'customer-9',
    name: 'حسن محمد – أسيوط',
    service: 'رحلة الغردقة',
    rating: 5,
    photo: photo(9),
    review: { text: 'أجمل إجازة قضيناها، كل التفاصيل اتعملت صح من غير أي دوشة', lang: 'ar' }
  },
  {
    id: 'customer-10',
    name: 'عمر شريف – القاهرة',
    service: 'رحلة الغردقة',
    rating: 5,
    photo: photo(10),
    review: { text: 'تعامل محترم وصدق في المواعيد، أنصح أي حد يحجز معاهم', lang: 'ar' }
  }
];