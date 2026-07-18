// TRICK: Kita membuat fungsi utilitas murni yang menerima fungsi pengubah state (stateSetter) dari React
export const showToast = (stateSetter, message, type = "success", duration = 3000) => {
    // Memperbarui state komponen React yang memanggilnya
    stateSetter({ show: true, message, type });

    // Otomatis menutup toast setelah durasi yang ditentukan selesai
    setTimeout(() => {
        stateSetter({ show: false, message: "", type: "success" });
    }, duration);
};