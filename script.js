// ==========================================
// KERANJANG BELANJA
// ==========================================

let keranjang = [];


// ==========================================
// STOK PRODUK
// ==========================================

let stokProduk = {};

document.querySelectorAll(".produk-card").forEach(function(kartu) {

    const nama =
        kartu.querySelector("h3").textContent.trim();

    const stokElement =
        kartu.querySelector(".stok");

    if (stokElement) {

        const stok =
            parseInt(stokElement.textContent.replace(/\D/g, "")) || 0;

        stokProduk[nama] = stok;

    }

});

// ==========================================
// TOMBOL TAMBAH KE KERANJANG
// ==========================================

const tombolProduk = document.querySelectorAll(
    ".produk-card .btn"
);

tombolProduk.forEach(function(tombol) {

    tombol.addEventListener("click", function() {

        const kartu = tombol.closest(".produk-card");

        const nama =
            kartu.querySelector("h3").textContent.trim();

        const hargaText =
            kartu.querySelector(".harga").textContent;

        const harga =
            parseInt(hargaText.replace(/\D/g, ""));

        // Cek stok
        if (stokProduk[nama] <= 0) {

            alert("Maaf, stok " + nama + " sudah habis.");

            return;

        }

        const produkAda =
            keranjang.find(function(produk) {

                return produk.nama === nama;

            });

        if (produkAda) {

            produkAda.jumlah++;

        } else {

            const areaPromo =
    kartu.querySelector(".harga-promo");

const promo =
    areaPromo
        ? parseInt(areaPromo.dataset.promo) || 0
        : 0;


keranjang.push({

    nama: nama,
    harga: harga,
    jumlah: 1,
    promo: promo > 0

});

        }

        // Kurangi stok
        stokProduk[nama]--;

        tampilkanKeranjang();

        tampilkanStok();

    });

});

// ==========================================
// TAMPILKAN KERANJANG
// ==========================================

function tampilkanKeranjang() {

    const areaKeranjang =
        document.querySelector(".keranjang");


    let html = `
        <h2>🛒 Keranjang Belanja</h2>
    `;


    let total = 0;


    if (keranjang.length === 0) {

        html += `
            <p>Keranjang masih kosong.</p>
        `;

    } else {

        keranjang.forEach(function(produk, index) {

            const subtotal =
                produk.harga * produk.jumlah;

            total += subtotal;


            html += `

                <div class="item-keranjang">

                    <div>

                        <strong>
                           ${produk.promo
                           ? "🔥 " + produk.nama
                           : produk.nama}
                        </strong>

                        <p>
                            Rp${produk.harga.toLocaleString("id-ID")}
                            × ${produk.jumlah}
                        </p>

                    </div>


                    <div>

                        <button
                            onclick="kurangiProduk(${index})">
                            −
                        </button>


                        <span>
                            ${produk.jumlah}
                        </span>


                        <button
                            onclick="tambahProduk(${index})">
                            +
                        </button>


                        <button
                            onclick="hapusProduk(${index})">
                            🗑️
                        </button>

                    </div>


                    <strong>
                        Rp${subtotal.toLocaleString("id-ID")}
                    </strong>

                </div>

            `;

        });


        html += `

            <hr>

            <div class="total-belanja">

                <strong>
                    Total Belanja
                </strong>

                <strong>
                    Rp${total.toLocaleString("id-ID")}
                </strong>

            </div>


            <button
                class="btn"
                onclick="scrollKeCheckout()">

                Checkout

            </button>

        `;

    }


    areaKeranjang.innerHTML = html;


    updateCheckoutTotal();

}
// ==========================================
// TAMPILKAN STOK TERBARU
// ==========================================

function tampilkanStok() {

    document.querySelectorAll(".produk-card").forEach(function(kartu) {

        const nama =
            kartu.querySelector("h3").textContent.trim();

        const stokElement =
            kartu.querySelector(".stok");

        if (stokElement && stokProduk[nama] !== undefined) {

            const stok =
                stokProduk[nama];


            // ==================================
            // STOK HABIS
            // ==================================

            if (stok <= 0) {

                stokElement.textContent =
                    "🔴 Stok habis";

            }


            // ==================================
            // STOK SEDIKIT
            // ==================================

            else if (stok <= 3) {

                stokElement.textContent =
                    "🟠 Stok sedikit: " + stok;

            }


            // ==================================
            // STOK AMAN
            // ==================================

            else {

                stokElement.textContent =
                    "🟢 Stok: " + stok;

            }

        }

    });

}


// ==========================================
// TAMBAH JUMLAH PRODUK
// ==========================================

function tambahProduk(index) {

    const produk =
        keranjang[index];

    // Cek stok
    if (stokProduk[produk.nama] <= 0) {

        alert("Maaf, stok " + produk.nama + " sudah habis.");

        return;

    }

    produk.jumlah++;

    // Kurangi stok
    stokProduk[produk.nama]--;

    tampilkanKeranjang();

    tampilkanStok();

}


// ==========================================
// KURANGI JUMLAH PRODUK
// ==========================================

function kurangiProduk(index) {

    const produk =
        keranjang[index];

    produk.jumlah--;

    // Kembalikan stok
    stokProduk[produk.nama]++;

    if (produk.jumlah <= 0) {

        keranjang.splice(index, 1);

    }

    tampilkanKeranjang();

    tampilkanStok();

}


// ==========================================
// HAPUS PRODUK
// ==========================================

function hapusProduk(index) {

    const produk =
        keranjang[index];

    // Kembalikan semua stok
    stokProduk[produk.nama] += produk.jumlah;

    keranjang.splice(index, 1);

    tampilkanKeranjang();

    tampilkanStok();

}


// ==========================================
// HITUNG TOTAL CHECKOUT
// ==========================================

function updateCheckoutTotal() {

    let subtotal = 0;


    keranjang.forEach(function(produk) {

        subtotal +=
            produk.harga * produk.jumlah;

    });


    const pilihanOngkir =
        document.querySelector("#ongkir");


    let ongkir = 0;


    if (pilihanOngkir) {

        ongkir =
            parseInt(pilihanOngkir.value) || 0;

    }


    const subtotalElement =
        document.querySelector("#checkout-subtotal");


    const ongkirElement =
        document.querySelector("#checkout-ongkir");


    const totalElement =
        document.querySelector("#checkout-total");


    if (subtotalElement) {

        subtotalElement.textContent =
            "Rp" +
            subtotal.toLocaleString("id-ID");

    }


    if (ongkirElement) {

        ongkirElement.textContent =
            "Rp" +
            ongkir.toLocaleString("id-ID");

    }


    if (totalElement) {

        const total = subtotal + ongkir;

        totalElement.textContent =
            "Rp" +
            total.toLocaleString("id-ID");

    }

}


// ==========================================
// PERUBAHAN ONGKIR
// ==========================================

const pilihanOngkir =
    document.querySelector("#ongkir");


if (pilihanOngkir) {

    pilihanOngkir.addEventListener(
        "change",
        function() {

            updateCheckoutTotal();

        }
    );

}


// ==========================================
// SCROLL KE CHECKOUT
// ==========================================

function scrollKeCheckout() {

    const checkout =
        document.querySelector("#checkout");


    if (checkout) {

        checkout.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ==========================================
// CHECKOUT KE WHATSAPP
// ==========================================

const formCheckout =
    document.querySelector("#form-checkout");


if (formCheckout) {

    formCheckout.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // Cek keranjang
            if (keranjang.length === 0) {

                alert(
                    "Keranjang masih kosong."
                );

                return;

            }


            // ==================================
            // DATA PELANGGAN
            // ==================================

            const nama =
                document.querySelector("#nama").value.trim();


            const whatsapp =
                document.querySelector("#whatsapp").value.trim();


            const alamat =
                document.querySelector("#alamat").value.trim();


            // ==================================
            // DATA ONGKIR
            // ==================================

            const pilihanOngkir =
                document.querySelector("#ongkir");


            const ongkir =
                parseInt(pilihanOngkir.value) || 0;


            // ==================================
            // HITUNG SUBTOTAL
            // ==================================

            let subtotal = 0;


            keranjang.forEach(function(produk) {

                subtotal +=
                    produk.harga * produk.jumlah;

            });


            const total =
                subtotal + ongkir;


            // ==================================
            // BUAT DAFTAR PRODUK
            // ==================================

            let daftarProduk = "";


            keranjang.forEach(
                function(produk, index) {

                    const nomor =
                        index + 1;


                    const subtotalProduk =
                        produk.harga *
                        produk.jumlah;


                    daftarProduk +=
                        nomor +
                        ". " +
                        produk.nama +
                        " x" +
                        produk.jumlah +
                        " = Rp" +
                        subtotalProduk.toLocaleString(
                            "id-ID"
                        ) +
                        "\n";

                }
            );


            // ==================================
            // BUAT PESAN WHATSAPP
            // ==================================

            const pesan =
                "Halo Toko Sembako Kita,\n\n" +

                "Saya ingin melakukan pemesanan:\n\n" +

                daftarProduk +

                "\n" +

                "Subtotal: Rp" +
                subtotal.toLocaleString("id-ID") +

                "\n" +

                "Ongkir: Rp" +
                ongkir.toLocaleString("id-ID") +

                "\n" +

                "Total: Rp" +
                total.toLocaleString("id-ID") +

                "\n\n" +

                "Nama: " +
                nama +

                "\n" +

                "WhatsApp: " +
                whatsapp +

                "\n" +

                "Alamat: " +
                alamat;


            // ==================================
            // NOMOR WHATSAPP TOKO
            // ==================================

            const nomorToko =
                "818060197637";


            // ==================================
            // BUAT LINK WHATSAPP
            // ==================================

            const url =
                "https://wa.me/" +
                nomorToko +
                "?text=" +
                encodeURIComponent(pesan);


            // ==================================
            // BUKA WHATSAPP
            // ==================================

            window.open(
                url,
                "_blank"
            );

        }
    );

}


// ==========================================
// JALANKAN SAAT WEBSITE DIBUKA
// ==========================================

tampilkanKeranjang();
// ==========================================
// PENCARIAN + FILTER KATEGORI
// ==========================================

const inputPencarian =
    document.querySelector("#input-pencarian");

const tombolKategori =
    document.querySelectorAll(".kategori-list button");

const semuaProduk =
    document.querySelectorAll(".produk-card");


// Kategori yang sedang dipilih
let kategoriAktif = "semua";


// ==========================================
// FUNGSI FILTER PRODUK
// ==========================================

function filterProduk() {

    const kataKunci =
        inputPencarian
            ? inputPencarian.value.toLowerCase().trim()
            : "";

    semuaProduk.forEach(function(produk) {

        const namaProduk =
            produk
                .querySelector("h3")
                .textContent
                .toLowerCase();

        const kategoriProduk =
            produk.dataset.kategori;

        const cocokKategori =
            kategoriAktif === "semua" ||
            kategoriProduk === kategoriAktif;

        const cocokPencarian =
            namaProduk.includes(kataKunci);

        if (cocokKategori && cocokPencarian) {

            produk.style.display = "";

        } else {

            produk.style.display = "none";

        }

    });

}


// ==========================================
// PENCARIAN PRODUK
// ==========================================

if (inputPencarian) {

    inputPencarian.addEventListener(
        "input",
        function() {

            filterProduk();

        }
    );

}


// ==========================================
// FILTER KATEGORI
// ==========================================

tombolKategori.forEach(function(tombol) {

    tombol.addEventListener(
        "click",
        function() {

            const teksKategori =
                tombol.textContent
                    .toLowerCase()
                    .trim();

            kategoriAktif = teksKategori;

            filterProduk();

        }
    );

});