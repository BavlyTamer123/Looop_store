// 1. إعدادات الصور (Slider)
const images = [
    "image/bc7692d4-68ea-4993-8d8a-74ea7b36ddfe.jpg",
    "image/6c7c65d7-6631-4e25-865b-cc4567007600.jpg",
    "image/0485f6a9-d0e8-46eb-94cc-8921a12f1c02.jpg"
];
let currentIndex = 0;

function changeImage(direction) {
    currentIndex += direction;
    if (currentIndex >= images.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = images.length - 1;
    const mainImg = document.getElementById('mainImage');
    if (mainImg) mainImg.src = images[currentIndex];
}

// 2. تحديث واجهة العربة (الرقم والقائمة المنسدلة)
function updateCartUI() {
    const cartItems = JSON.parse(localStorage.getItem('myCart')) || [];

    // تحديث العداد الرقمي
    const countSpan = document.getElementById('cart-count');
    if (countSpan) countSpan.innerText = cartItems.length;

    // تحديث القائمة المنسدلة (إذا كانت موجودة في الـ HTML)
    const container = document.getElementById('cart-items-content');
    if (container) {
        if (cartItems.length === 0) {
            container.innerHTML = '<p style="font-size: 14px; color: gray; padding: 10px;">العربة فارغة حالياً</p>';
        } else {
            container.innerHTML = cartItems.map((item, index) => `
                <div style="border-bottom: 1px solid #eee; padding: 10px; font-size: 13px; color: black; text-align: right;">
                    <strong>${item.name}</strong><br>
                    المقاس: ${item.size} | اللون: ${item.color}<br>
                    <span style="color: orange; font-weight: bold;">${item.price}</span>
                </div>
            `).join('');
        }
    }
}

// 3. وظيفة الإضافة للسلة (تأثير الطيران + حفظ البيانات)
function addToMyCart() {
    // جلب الاختيارات
    const selectedSize = document.querySelector('input[name="size"]:checked')?.value;
    const selectedColor = document.querySelector('input[name="color"]:checked')?.value;

    if (!selectedSize || !selectedColor) {
        alert("من فضلك اختر المق IS والمقاس واللون أولاً! 😉");
        return;
    }

    const imgElement = document.getElementById('mainImage');
    const cartWrapper = document.getElementById('cartWrapper'); // الحاوية الفسفورية

    if (!imgElement || !cartWrapper) return;

    // --- تأثير الطيران ---
    const flyingImg = imgElement.cloneNode();
    const rect = imgElement.getBoundingClientRect();
    const cartRect = cartWrapper.getBoundingClientRect();

    Object.assign(flyingImg.style, {
        position: 'fixed',
        top: rect.top + 'px',
        left: rect.left + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
        zIndex: '5000',
        transition: 'all 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95)',
        borderRadius: '10px',
        pointerEvents: 'none',
        opacity: '1'
    });

    document.body.appendChild(flyingImg);

    requestAnimationFrame(() => {
        flyingImg.style.top = cartRect.top + 'px';
        flyingImg.style.left = cartRect.left + 'px';
        flyingImg.style.width = '20px';
        flyingImg.style.height = '20px';
        flyingImg.style.transform = 'rotate(720deg)';
        flyingImg.style.opacity = '0.3';
    });

    // --- حفظ البيانات في LocalStorage ---
    let cartItems = JSON.parse(localStorage.getItem('myCart')) || [];
    cartItems.push({
        name: document.getElementById('productTitle')?.innerText || "Black Crochet Sweater",
        price: "700 EGP",
        size: selectedSize,
        color: selectedColor,
        image: imgElement.src
    });
    localStorage.setItem('myCart', JSON.stringify(cartItems));

    // --- إنهاء الأنيميشن وتحديث الشكل ---
    setTimeout(() => {
        flyingImg.remove();

        // تأثير هزة للعربة
        cartWrapper.style.animation = "shake 0.5s ease";
        updateCartUI();

        setTimeout(() => {
            cartWrapper.style.animation = "";
        }, 500);
    }, 800);
}

// 4. إظهار وإخفاء قائمة العربة (Dropdown)
function toggleCartDisplay() {
    const menu = document.getElementById('cart-menu');
    if (menu) {
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
    }
}

// تشغيل التحديث عند تحميل الصفحة لأول مرة
document.addEventListener('DOMContentLoaded', updateCartUI);