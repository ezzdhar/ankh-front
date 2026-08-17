"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/hooks";
import { AddressCard, AddNewAddressCard } from "@/components/address";
import { useAddresses, useDeleteAddress } from "@/hooks/useAddress";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AddressesPage() {
  return (
    <ProtectedRoute>
      <AddressesContent />
    </ProtectedRoute>
  );
}

function AddressesContent() {
  const { t } = useTranslation("address");
  const router = useRouter();
  const { data: addressesData, isLoading } = useAddresses();
  const deleteAddress = useDeleteAddress();
  const [deleteTargetId, setDeleteTargetId] = useState<number | string | null>(
    null,
  );

  const handleDelete = (id: number | string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      deleteAddress.mutate(deleteTargetId, {
        onSettled: () => setDeleteTargetId(null),
      });
    }
  };

  const handleEdit = (id: number | string) => {
    router.push(`/add-address?id=${id}`);
  };

  const addresses = addressesData?.data || [];

  if (isLoading) {
    return <Loader minHeight="min-h-screen" size="lg" />;
  }

  return (
    <div className="min-h-screen bg-[#FFF8EF] py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-[40px] font-bold text-[#3A0F0E] mb-2 font-cormorant">
            {t("list.title")}
          </h1>
          <p className="text-[#8C8C8C] text-lg">{t("list.subtitle")}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onDelete={() => handleDelete(address.id)}
              onEdit={() => handleEdit(address.id)}
            />
          ))}

          {/* Add New Card */}
          <AddNewAddressCard />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <DialogContent className="sm:max-w-[425px] bg-[#FFF8EF] border-[#3A0F0E]/10 p-6 rounded-2xl text-[#3A0F0E]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-cormorant font-bold text-[#3A0F0E] text-center">
              {t("list.delete")}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#3A0F0E]/80 text-center">
              {t("list.confirmDelete")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row items-center justify-center gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTargetId(null)}
              className="border-[#3A0F0E]/30 text-[#3A0F0E] hover:bg-[#3A0F0E]/10 rounded-full px-6 cursor-pointer"
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              isLoading={deleteAddress.isPending}
              className="bg-red-600! hover:bg-red-700! text-white rounded-full px-6 cursor-pointer"
            >
              {t("list.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
