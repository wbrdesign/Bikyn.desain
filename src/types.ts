export type ServiceCategory = 'Dokumen' | 'Promosi' | 'Foto' | 'Undangan' | 'Digital';

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  minOrder: string;
  description: string;
  price: string;
  priceUnit: string;
  duration: string;
  imageUrl?: string;
  svgMockupType: 'document' | 'photocopy' | 'laminating' | 'typing' | 'banner' | 'brochure' | 'menu' | 'sticker' | 'namecard' | 'receipt' | 'pasphoto' | 'polaroid' | 'photo2r' | 'invitation' | 'blanko' | 'birthday' | 'certificate' | 'design' | 'cv' | 'email' | 'custom';
  specifications: string[];
  paperOptions?: string[];
  isPopular?: boolean;
}

export interface StudioConfig {
  brandName: string;
  subBrand: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string; // digits only for wa.me link e.g. 6285712345678
  whatsappDisplayNumber: string; // e.g. 0857-1234-5678
  adminName: string;
  email: string;
  instagram: string;
  tiktok: string;
  address: string;
  hoursWeekday: string;
  hoursWeekend: string;
}

export interface OrderFormState {
  serviceId: string;
  customerName: string;
  quantity: string;
  fileStatus: 'siap' | 'bantuan';
  notes: string;
}
