import type { Localized } from '../types/i18n';

/** Single source of truth for every contact detail used across the site. */
export const contact = {
  phoneDisplay: '01117888955',
  phoneHref: 'tel:+201117888955',

  whatsappDisplay: '01019483858',
  whatsappNumber: '201019483858',
  whatsappUrl: 'https://wa.me/201019483858',
  whatsappMessage: {
    ar: 'مرحبًا رحال، أريد الاستفسار عن رحلة',
    en: 'Hello Rahhal, I would like to inquire about a trip.'
  } as Localized,

  email: 'rahaltravel10@gmail.com',
  emailPlaceholder: '[info@yourdomain.com]',

  mapsUrl: 'https://maps.app.goo.gl/nfeimK62TH61znDU6',
  // Replace with "lat,lng" of the office to pin it precisely on the embedded map.
  mapEmbedQuery: '27.441519,30.819515',

  // TODO: add the Google Business review link.
  googleReviewUrl: '#',

  social: {
    facebook: 'https://www.facebook.com/share/1DcnpuBKmo/?mibextid=wwXIfr',
    // TODO: add the real Instagram profile link.
    instagram: '#',
    // TODO: add the real TikTok profile link.
    tiktok: '#'
  }
};