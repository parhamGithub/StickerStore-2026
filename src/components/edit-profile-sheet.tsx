"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X } from "lucide-react";
import toast from "react-hot-toast";
import LocationInput from "@/components/location-input";
import type { EditUser } from "@/app/profile/page";

interface Props {
  open: boolean;
  onClose: () => void;
  user: EditUser;
  onSaved: (updated: EditUser) => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sheetVariants = {
  hidden: { y: "100%" },
  visible: { y: 0, transition: { type: "spring" as const, damping: 30, stiffness: 300 } },
  exit: { y: "100%", transition: { type: "spring" as const, damping: 30, stiffness: 300 } },
};

export default function EditProfileSheet({ open, onClose, user, onSaved }: Props) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatarSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    const token = localStorage.getItem("token");
    if (!token) return;
    setSaving(true);

    try {
      let avatarUrl: string | undefined;

      if (avatarFile) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: avatarFile,
        });
        if (!uploadRes.ok) throw new Error("Avatar upload failed");
        const { url } = await uploadRes.json();
        avatarUrl = url;
      }

      const body: Record<string, string> = { name };
      if (phone !== (user.phone ?? "")) body.phone = phone;
      if (location !== (user.location ?? "")) body.location = location;
      if (avatarUrl) body.avatar = avatarUrl;

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      const updated = await res.json();
      onSaved(updated);
      toast.success("Profile updated");
      onClose();
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (!saving) {
      setName(user.name);
      setPhone(user.phone ?? "");
      setLocation(user.location ?? "");
      setAvatarPreview(null);
      setAvatarFile(null);
      onClose();
    }
  }

  const displayAvatar = avatarPreview ?? user.avatar;
  const hasChanges =
    name !== user.name ||
    phone !== (user.phone ?? "") ||
    location !== (user.location ?? "") ||
    avatarFile !== null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleClose}
          />
          <motion.div
            key="sheet"
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-white px-6 pb-8 pt-5 shadow-xl max-h-[85vh] overflow-y-auto"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-fredoka text-[22px] font-semibold text-foreground">
                Edit profile
              </h2>
              <button
                onClick={handleClose}
                className="flex size-9 items-center justify-center rounded-full bg-foreground/5 text-foreground cursor-pointer border-none hover:bg-foreground/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div
                className="relative size-24 cursor-pointer group"
                onClick={() => fileRef.current?.click()}
              >
                <div className="size-24 rounded-full bg-yellow border-[4px] border-white shadow-md flex items-center justify-center font-fredoka font-semibold text-[28px] text-foreground overflow-hidden">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    user.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/30 transition-colors">
                  <Camera size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
              <span className="text-[13px] text-text-secondary mt-2 font-medium">
                Tap to change photo
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[13px] font-bold text-foreground mb-1.5 block">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-[14px] text-foreground outline-none focus:border-coral transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="text-[13px] font-bold text-foreground mb-1.5 block">
                  Email
                </label>
                <input
                  value={user.email}
                  disabled
                  className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-[14px] text-text-secondary outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[13px] font-bold text-foreground mb-1.5 block">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-[14px] text-foreground outline-none focus:border-coral transition-colors"
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                />
              </div>
              <div>
                <label className="text-[13px] font-bold text-foreground mb-1.5 block">
                  Location
                </label>
                <LocationInput
                  key={`loc-${open}`}
                  value={location}
                  onChange={setLocation}
                  placeholder="Search for a place..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClose}
                disabled={saving}
                className="flex-1 rounded-full border border-foreground/20 bg-transparent py-3 text-[14px] font-bold text-foreground cursor-pointer hover:bg-foreground/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges || !name.trim()}
                className="flex-1 rounded-full bg-coral py-3 text-[14px] font-bold text-white cursor-pointer border-none hover:brightness-110 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
