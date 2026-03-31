const address = {
  title: "Add A Delivery Address",
  subtitle: "",
  city: {
    label: "City",
    placeholder: "Select City",
  },
  details: {
    label: "Address Details",
    placeholder: "Enter full address (street, building",
  },
  postalCode: {
    label: "Postal Code",
    placeholder: "Any special notes for delivery or your order ?",
  },
  submit: "Save Address",
  cancel: "Cancel",
  list: {
    title: "My Addresses",
    subtitle: "Manage your delivery addresses",
    default: "Default",
    edit: "Edit",
    delete: "Delete",
    addNew: {
      title: "Add A New Address",
      subtitle: "Click to add a new delivery address",
    },
    centralArea: "central area",
    confirmDelete: "Are you sure you want to delete this address?",
  },
  success: {
    create: "Address added successfully!",
    update: "Address updated successfully!",
    delete: "Address deleted successfully!",
  },
  validation: {
    governorateRequired: "Governorate is required",
    cityRequired: "City / Area is required",
    streetRequired: "Street name is required",
    buildingRequired: "Building number is required",
    phoneRequired: "Phone number is required",
  },
};

export default address;
