export const getProfile = async (authFetch) => {
  const data = await authFetch('/users/me');
  return data.user;
};

export const updateProfile = async (authFetch, updates) => {
  const data = await authFetch('/users/me', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data.user;
};

export const getMedicalRecord = async (authFetch) => {
  const data = await authFetch('/medical');
  return data.medical;
};

export const createMedicalRecord = async (authFetch, payload) => {
  const data = await authFetch('/medical', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.medical;
};

export const updateMedicalRecord = async (authFetch, payload) => {
  const data = await authFetch('/medical', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data;
};

export const deleteMedicalRecord = async (authFetch) => {
  const data = await authFetch('/medical', {
    method: 'DELETE',
  });
  return data;
};

export const getContacts = async (authFetch) => {
  const data = await authFetch('/contacts');
  return data.contacts;
};

export const createContact = async (authFetch, payload) => {
  const data = await authFetch('/contacts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.contact;
};

export const updateContact = async (authFetch, id, payload) => {
  const data = await authFetch(`/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data;
};

export const deleteContact = async (authFetch, id) => {
  const data = await authFetch(`/contacts/${id}`, {
    method: 'DELETE',
  });
  return data;
};

export const triggerPanic = async (authFetch, payload) => {
  const data = await authFetch('/panic', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
};

export const getPanicHistory = async (authFetch) => {
  const data = await authFetch('/panic/history');
  return data.panic_logs;
};

export const getNotifications = async (authFetch) => {
  const data = await authFetch('/notifications');
  return data.notifications;
};

export const markNotificationRead = async (authFetch, id) => {
  const data = await authFetch(`/notifications/${id}/read`, { method: 'PUT' });
  return data;
};

export const markAllNotificationsRead = async (authFetch) => {
  const data = await authFetch('/notifications/read-all', { method: 'PUT' });
  return data;
};

export const deleteNotification = async (authFetch, id) => {
  const data = await authFetch(`/notifications/${id}`, { method: 'DELETE' });
  return data;
};

export const getUserSettings = async (authFetch) => {
  const data = await authFetch('/users/settings');
  return data.settings;
};

export const updateUserSettings = async (authFetch, payload) => {
  const data = await authFetch('/users/settings', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  return data.settings;
};

export const getAdminDashboardStats = async (authFetch) => {
  const data = await authFetch('/admin/dashboard/stats');
  return data.stats;
};

export const getAdminPanicLogs = async (authFetch) => {
  const data = await authFetch('/admin/panic');
  return data.panic_logs;
};

export const getAdminMedicalRecords = async (authFetch) => {
  const data = await authFetch('/admin/medical');
  return data.medical_records;
};

export const getAdminNotifications = async (authFetch) => {
  const data = await authFetch('/admin/notifications');
  return data.notifications;
};

export const getAdminUsers = async (authFetch) => {
  const data = await authFetch('/admin/users');
  return data.users;
};

export const createAdminUser = async (authFetch, payload) => {
  const data = await authFetch('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
};

export const deleteAdminUser = async (authFetch, id) => {
  const data = await authFetch(`/admin/users/${id}`, {
    method: 'DELETE',
  });
  return data;
};

export const getAdminSettings = async (authFetch) => {
  const data = await authFetch('/admin/config');
  return data.settings;
};

export const updateAdminSettings = async (authFetch, payload) => {
  const data = await authFetch('/admin/config', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data.settings;
};
