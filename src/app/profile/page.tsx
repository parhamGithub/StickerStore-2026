"use client";

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EditProfileSheet from "@/components/edit-profile-sheet";
import { useGetProductsQuery } from "@/lib/features/products-api-slice";
import StickerCard from "@/components/sticker-card";
import { useToggleLikeMutation } from "@/lib/features/products-api-slice";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
}

export interface EditUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  avatar: string | null;
  createdAt: string;
}

interface ProfileData {
  user: EditUser;
  stats: {
    ordersPlaced: number;
    stickersCollected: number;
    savedForLater: number;
  };
  orders: Order[];
  likedProductIds: string[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusInfo(
  createdAt: string,
): { label: string; className: string } {
  const days = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / 86400000,
  );
  if (days < 3) return { label: "Processing", className: "bg-yellow/20 text-[#a97a08]" };
  if (days < 10) return { label: "Shipped", className: "bg-purple/12 text-purple" };
  return { label: "Delivered", className: "bg-green/15 text-[#4a9c3c]" };
}

const orderThumbBg = [
  "bg-yellow",
  "bg-purple",
  "bg-teal",
  "bg-pink",
  "bg-green",
  "bg-coral",
];

const orderEmoji = ["☀️", "⭐", "☁️", "🌸", "🌈", "🍀"];

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [editOpen, setEditOpen] = useState(false);

  const handleProfileSaved = useCallback((updated: EditUser) => {
    setData((prev) => (prev ? { ...prev, user: updated } : prev));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");

    if (!token || !stored) {
      router.replace("/signin");
      return;
    }

    let mounted = true;

    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/signin");
          return undefined;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        return res.json();
      })
      .then((json) => {
        if (!mounted) return;
        if (json !== undefined) {
          setData(json);
        }
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Could not load profile. Make sure the backend server is running.");
        setLoading(false);
      });

    return () => { mounted = false; };
  }, [router, retry]);

  const [activeTab, setActiveTab] = useState<"orders" | "favorites" | "account">("orders");
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });

  useLayoutEffect(() => {
    if (!tabBarRef.current) return;
    const btn = tabBarRef.current.querySelector<HTMLElement>(`[data-tab="${activeTab}"]`);
    if (!btn) return;
    const tabBarRect = tabBarRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicatorStyle({ width: btnRect.width, left: btnRect.left - tabBarRect.left });
  }, [activeTab]);

  const { data: allProducts } = useGetProductsQuery();
  const [toggleLike] = useToggleLikeMutation();

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 mx-auto w-full max-w-[1312px] px-4 md:px-8 lg:px-16 pt-14 md:pt-16">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-foreground/5 rounded-[28px]" />
            <div className="grid grid-cols-3 gap-5">
              <div className="h-24 bg-foreground/5 rounded-[20px]" />
              <div className="h-24 bg-foreground/5 rounded-[20px]" />
              <div className="h-24 bg-foreground/5 rounded-[20px]" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="flex-1 mx-auto w-full max-w-[1312px] px-4 md:px-8 lg:px-16 pt-14 md:pt-16">
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-text-secondary text-[15px]">{error}</p>
            <button
              onClick={() => setRetry((c) => c + 1)}
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-white no-underline shadow-brand hover:brightness-110 cursor-pointer border-none"
            >
              Try again
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!data) {
    return null;
  }

  const { user, stats, orders, likedProductIds } = data;
  const initials = getInitials(user.name);
  const memberSince = formatDate(user.createdAt);
  const likedProducts = allProducts?.filter((p) => likedProductIds.includes(p.id)) ?? [];

  const likedCards = likedProducts.map((product) => (
    <StickerCard
      key={product.id}
      product={product}
      liked={true}
      onToggleLike={() => toggleLike(product.id)}
    />
  ));

  const tabClass = (tab: string) =>
    `font-bold text-[14.5px] px-1 pb-3 mr-7 cursor-pointer transition-colors ${
      activeTab === tab
        ? "text-foreground"
        : "text-text-secondary"
    }`;

  return (
    <>
      <Header />
      <EditProfileSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        onSaved={handleProfileSaved}
      />
      <main className="flex-1 mx-auto w-full max-w-[1312px] px-4 md:px-8 lg:px-16 pt-14 md:pt-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 bg-white border border-foreground/10 rounded-[28px] p-6 md:p-9 lg:p-10 shadow-card">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="size-20 md:size-24 shrink-0 rounded-full bg-yellow border-[6px] border-white shadow-[0_10px_18px_rgba(0,0,0,0.14)] flex items-center justify-center font-fredoka font-semibold text-[28px] md:text-[34px] text-foreground overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="size-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className="font-fredoka text-[24px] md:text-[30px] font-semibold text-foreground m-0 leading-tight">
                {user.name}
              </h1>
              <p className="text-text-secondary text-[14px] md:text-[15px] m-0 mt-1">
                {user.email}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[13px] text-text-secondary">
                {user.phone && <span>{user.phone}</span>}
                {user.location && <span>{user.location}</span>}
              </div>
              <span className="inline-block mt-2.5 text-[12.5px] font-bold bg-cream border border-dashed border-foreground/15 rounded-full px-3 py-1.5">
                🎉 Member since {memberSince}
              </span>
            </div>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="bg-foreground text-background font-bold text-[14.5px] px-[26px] py-[14px] rounded-full whitespace-nowrap cursor-pointer border-none hover:opacity-90 transition-opacity"
          >
            Edit profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <div className="bg-white border border-foreground/10 rounded-[20px] p-[22px_24px] shadow-card">
            <div className="font-fredoka font-semibold text-[32px] text-coral">
              {stats.ordersPlaced}
            </div>
            <div className="text-text-secondary text-[13.5px] font-semibold mt-1">
              Orders placed
            </div>
          </div>
          <div className="bg-white border border-foreground/10 rounded-[20px] p-[22px_24px] shadow-card">
            <div className="font-fredoka font-semibold text-[32px] text-purple">
              {stats.stickersCollected}
            </div>
            <div className="text-text-secondary text-[13.5px] font-semibold mt-1">
              Stickers collected
            </div>
          </div>
          <div className="bg-white border border-foreground/10 rounded-[20px] p-[22px_24px] shadow-card">
            <div className="font-fredoka font-semibold text-[32px] text-teal">
              {stats.savedForLater}
            </div>
            <div className="text-text-secondary text-[13.5px] font-semibold mt-1">
              Favorites
            </div>
          </div>
        </div>

        <div ref={tabBarRef} className="relative flex gap-2.5 mt-10 border-b border-foreground/10">
          <button
            data-tab="orders"
            onClick={() => setActiveTab("orders")}
            className={tabClass("orders")}
          >
            Order history
          </button>
          <button
            data-tab="favorites"
            onClick={() => setActiveTab("favorites")}
            className={tabClass("favorites")}
          >
            Favorites
          </button>
          <button
            data-tab="account"
            onClick={() => setActiveTab("account")}
            className={tabClass("account")}
          >
            Account details
          </button>
          <motion.span
            layoutId="profile-tab-indicator"
            className="absolute bottom-0 h-0.5 bg-coral rounded-full"
            style={{ width: indicatorStyle.width, left: indicatorStyle.left }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-fredoka font-semibold text-[22px] text-foreground mt-7 mb-[18px]">
                Recent orders
              </h3>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16">
                  <p className="font-nunito text-[15px] text-text-secondary">
                    No orders yet.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-white no-underline shadow-brand hover:brightness-110"
                  >
                    Start shopping
                  </Link>
                </div>
              ) : (
                orders.map((order, i) => {
                  const orderItems = order.items;
                  const title =
                    orderItems.length === 1
                      ? orderItems[0].name
                      : `${orderItems[0].name} + ${orderItems.length - 1} more`;
                  const totalQty = orderItems.reduce((s, oi) => s + oi.quantity, 0);
                  const status = statusInfo(order.createdAt);

                  return (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 md:gap-5 bg-white border border-foreground/10 rounded-[20px] p-[18px_22px] mb-3.5 shadow-card"
                    >
                      <div
                        className={`size-14 shrink-0 rounded-[14px] flex items-center justify-center text-[24px] ${orderThumbBg[i % orderThumbBg.length]}`}
                      >
                        {orderEmoji[i % orderEmoji.length]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-fredoka font-semibold text-[16px] text-foreground truncate">
                          {title}
                        </div>
                        <div className="text-text-secondary text-[13px] mt-0.5">
                          Order #{order.id} · {formatDate(order.createdAt)}
                          {totalQty > 1 && ` · ${totalQty} items`}
                        </div>
                      </div>
                      <span
                        className={`text-[12px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${status.className}`}
                      >
                        {status.label}
                      </span>
                      <div className="font-extrabold text-[15.5px] text-foreground mr-1 shrink-0">
                        ${order.total.toFixed(2)}
                      </div>
                      <a
                        href="#"
                        className="font-bold text-[13.5px] text-foreground whitespace-nowrap no-underline"
                      >
                        View →
                      </a>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-fredoka font-semibold text-[22px] text-foreground mt-7 mb-[18px]">
                Favorites
              </h3>

              {likedProducts.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16">
                  <p className="font-nunito text-[15px] text-text-secondary">
                    No favorites yet.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-white no-underline shadow-brand hover:brightness-110"
                  >
                    Browse stickers
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center sm:justify-start gap-5 md:gap-7 mt-7">
                  {likedCards}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-6 py-16"
            >
              <div className="text-center">
                <p className="font-fredoka font-semibold text-[18px] text-foreground">
                  {user.name}
                </p>
                <p className="font-nunito text-[14px] text-text-secondary mt-1">
                  {user.email}
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  localStorage.removeItem("user")
                  router.push("/")
                }}
                className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-6 py-3 text-[14px] font-bold text-foreground cursor-pointer hover:bg-foreground/5 transition-colors"
              >
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}