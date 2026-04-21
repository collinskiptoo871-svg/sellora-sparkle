import { Link } from "@tanstack/react-router";
import { Eye, Heart, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string | null;
  photos: string[];
  views: number;
  seller_id: string;
}

export function ProductCard({ p }: { p: ProductCardData }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [seller, setSeller] = useState<{ display_name: string | null; avatar_url: string | null }>({
    display_name: null,
    avatar_url: null,
  });

  useEffect(() => {
    supabase.from("profiles").select("display_name,avatar_url").eq("user_id", p.seller_id).maybeSingle()
      .then(({ data }) => data && setSeller(data));
    if (user) {
      supabase.from("favorites").select("id").eq("user_id", user.id).eq("product_id", p.id).maybeSingle()
        .then(({ data }) => setSaved(!!data));
    }
  }, [p.id, p.seller_id, user]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to save items");
      return;
    }
    if (saved) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", p.id);
      setSaved(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, product_id: p.id });
      setSaved(true);
    }
  };

  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="block overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-elegant)]"
    >
      <div className="relative aspect-square w-full bg-muted">
        {p.photos[0] ? (
          <img
            src={p.photos[0]}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No photo</div>
        )}
        <button
          onClick={toggleSave}
          aria-label={saved ? "Remove from saved" : "Save"}
          aria-pressed={saved}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 backdrop-blur"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
      </div>
      <div className="space-y-1 p-3">
        <p className="text-sm font-bold text-primary">
          {p.currency} {p.price.toLocaleString()}
        </p>
        <p className="line-clamp-1 text-sm font-medium text-foreground">{p.title}</p>
        {p.location && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {p.location}
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="line-clamp-1 text-xs text-muted-foreground">{seller.display_name ?? "Seller"}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" /> {p.views}
          </span>
        </div>
      </div>
    </Link>
  );
}
