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
      site_documents: {
        Row: {
          kind: string;
          content: Json;
          revision: number;
          updated_at: string;
        };
        Insert: {
          kind: string;
          content?: Json;
          revision?: number;
          updated_at?: string;
        };
        Update: { content?: Json; revision?: number; updated_at?: string };
        Relationships: [];
      };
      site_assets: {
        Row: {
          id: string;
          object_key: string;
          url: string;
          name: string;
          type: string;
          content_type: string;
          size: number;
          ready: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          object_key: string;
          url: string;
          name: string;
          type: string;
          content_type: string;
          size: number;
          ready?: boolean;
        };
        Update: { ready?: boolean };
        Relationships: [];
      };
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
        Relationships: [];
      };
      celebrations: {
        Row: {
          id: string;
          slug: string;
          child_name: string;
          age: number | null;
          title: string;
          event_date: string | null;
          district: string | null;
          venue: string | null;
          theme: string | null;
          short_description: string | null;
          long_description: string | null;
          cover_url: string | null;
          trailer_url: string | null;
          featured: boolean;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          [K in keyof Database["public"]["Tables"]["celebrations"]["Row"]]?: Database["public"]["Tables"]["celebrations"]["Row"][K];
        };
        Update: Partial<Database["public"]["Tables"]["celebrations"]["Insert"]>;
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          celebration_id: string;
          type: string;
          url: string;
          thumbnail_url: string | null;
          alt: string | null;
          width: number | null;
          height: number | null;
          duration_seconds: number | null;
          sort_order: number;
          featured: boolean;
          created_at: string;
        };
        Insert: {
          [K in keyof Database["public"]["Tables"]["media"]["Row"]]?: Database["public"]["Tables"]["media"]["Row"][K];
        };
        Update: Partial<Database["public"]["Tables"]["media"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "media_celebration_id_fkey";
            columns: ["celebration_id"];
            isOneToOne: false;
            referencedRelation: "celebrations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      save_site_document: {
        Args: { target_kind: string; payload: Json; expected_revision: number };
        Returns: Database["public"]["Tables"]["site_documents"]["Row"][];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
