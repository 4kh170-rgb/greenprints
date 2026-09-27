import { collection, query, where, getDocs, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// دالة لحفظ عميل جديد مع التحقق من عدم تكرار رقم الهوية
async function saveClientData(clientData) {
  try {
    const idNumber = clientData.idNumber; // تأكد أن هذا هو اسم حقل رقم الهوية لديك

    if (!idNumber) {
      alert("الرجاء إدخال رقم الهوية");
      return;
    }

    // 1. التحقق مما إذا كان رقم الهوية موجود مسبقاً في مجموعة clients
    const q = query(collection(db, "clients"), where("idNumber", "==", idNumber));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("عذراً، رقم الهوية مسجل مسبقاً ولا يمكن تكراره!");
      return; // إيقاف العملية إذا كان موجوداً
    }

    // 2. الطريقة الأولى: الإضافة التلقائية مع معرف عشوائي إذا لم يكن موجوداً
    await addDoc(collection(db, "clients"), {
      ...clientData,
      createdAt: new Date()
    });

    /* 
      أو الطريقة الثانية (الأفضل لمنع التكرار تماماً): 
      جعل رقم الهوية هو معرف المستند (Document ID) نفسه، بحيث يمنع فايربيس التكرار تلقائياً:
      await setDoc(doc(db, "clients", idNumber), {
        ...clientData,
        createdAt: new Date()
      });
    */

    alert("تم حفظ البيانات بنجاح!");
    
    // إعادة تحميل الجدول لتحديث البيانات إذا كنت في لوحة الإدارة
    if (typeof fetchAndDisplayUsers === "function") {
      fetchAndDisplayUsers();
    }

  } catch (error) {
    console.error("حدث خطأ أثناء الحفظ: ", error);
    alert("حدث خطأ أثناء الحفظ، يرجى المحاولة مرة أخرى.");
  }
}