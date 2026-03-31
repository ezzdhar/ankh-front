"use client";

import { useTranslation } from "@/i18n/hooks";
import { AddressCard, AddNewAddressCard } from "@/components/address";
import { useAddresses, useDeleteAddress } from "@/hooks/useAddress";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

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

  const handleDelete = async (id: number | string) => {
    if (window.confirm(t("list.confirmDelete"))) {
      deleteAddress.mutate(id);
    }
  };

  const handleEdit = (id: number | string) => {
    router.push(`/add-address?id=${id}`);
  };

  const addresses = addressesData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8EF] py-12 px-4 flex items-center justify-center">
        <div className="text-[#3A0F0E] animate-pulse">
          {t("common:loading")}
        </div>
      </div>
    );
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
    </div>
  );
}
