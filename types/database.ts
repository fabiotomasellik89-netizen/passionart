export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          short_description: string;
          description: string;
          category: string;
          event_type: string;
          base_price: number;
          is_featured: boolean;
          is_active: boolean;
          is_customizable: boolean;
          inspiration_type: string;
          default_shape: string;
          materials: string[];
          production_notes: string;
          lead_time_days: number;
          badge: string;
          palette: string[];
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt: string;
          sort_order: number;
          is_cover: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["product_images"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["product_images"]["Row"]>;
      };
      addon_groups: {
        Row: {
          id: string;
          name: string;
          description: string;
        };
        Insert: Partial<Database["public"]["Tables"]["addon_groups"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["addon_groups"]["Row"]>;
      };
      addon_options: {
        Row: {
          id: string;
          group_id: string;
          label: string;
          price: number;
          description: string;
          tone: string;
        };
        Insert: Partial<Database["public"]["Tables"]["addon_options"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["addon_options"]["Row"]>;
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          status: string;
          payment_status: string;
          paypal_order_id: string | null;
          total: number;
          customer: Json;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_name: string;
          product_slug: string;
          unit_price: number;
          total_price: number;
          quantity: number;
          configuration: Json;
        };
        Insert: Partial<Database["public"]["Tables"]["order_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Row"]>;
      };
    };
  };
};
