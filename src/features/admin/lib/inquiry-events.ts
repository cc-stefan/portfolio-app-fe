export const ADMIN_INQUIRIES_UPDATED_EVENT = "admin-inquiries-updated";

export function dispatchAdminInquiriesUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(ADMIN_INQUIRIES_UPDATED_EVENT));
}
