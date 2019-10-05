const getEle = id => document.getElementById(id);

let mangSanPham = [];
let gioHang = [];
let soLuongSanPham = 0;
let href = window.location.href;
let param = href.split("?")[1];

const HienThiChiTietSanPham = (sanPham) => {
    /*Hien thi
        TenSP
        Gia tien
        Thanh dieu chinh SP -- So luong SP
        Nut chon mua (them vao gio hang)
    */
    let content = "";
    content += `
        <div class="row">
            <div class="col-md-6">
                <img class="mt-2" src="${sanPham.hinhAnhSP}" width="100%" height="80%">
            </div>
            <div class="col-md-6">
                <h1>${sanPham.tenSP}</h1>
                <h4>${sanPham.giaSP}</h4>
                <span>Số lượng  </span>
                <button class="btn btn-primary" onClick="GiamSoLuongSP()">-</button>
                <input id="soLuongSanPham" value=${soLuongSanPham} disable>
                <button class="btn btn-primary" onClick="TangSoLuongSP()">+</button>
                <br/>
                <button onClick="ThemGioHang(${sanPham.maSP})" class="btn btn-success"><i class="fa fa-shopping-cart"></i></button>
            </div>
        </div>
    `
    getEle("sanPhamChiTiet").innerHTML = content;
}

const ThemGioHang = (idSanPham) => {
    const sanPhamMoi = { maSP: idSanPham, soLuong: soLuongSanPham };
    gioHang = [...gioHang, sanPhamMoi];
    localStorage.setItem("gioHang", JSON.stringify(gioHang));
    alert("Thêm thành công");
}

const GiamSoLuongSP = () => {
    if (soLuongSanPham <=1) {
        return;
    }
    else {
        soLuongSanPham -= 1;
    }
    getEle("soLuongSanPham").value = soLuongSanPham;
}

const TangSoLuongSP = () => {
    soLuongSanPham += 1;
    getEle("soLuongSanPham").value = soLuongSanPham;
}

if (param) {
    const id = param.split("=")[1];
    getEle("danhSachSanPham").style.display = "none";
    mangSanPham = JSON.parse(localStorage.getItem("mangSanPham"));
    const sanPhamChiTiet = mangSanPham.find((sanPham) => sanPham.maSP === id);
    HienThiChiTietSanPham(sanPhamChiTiet);
}

const LayThongTin = () => {
    const maSanPham = getEle("maSP").value;
    const tenSanPham = getEle("tenSP").value;
    const giaSanPham = getEle("gia").value;
    const hinhAnh = getEle("hinhAnh").value;

    const sanPham = new SanPham(maSanPham, tenSanPham, giaSanPham, hinhAnh);
    return sanPham;
}

const ThemSanPham = () => {
    let sanPham = LayThongTin();

    mangSanPham = [...mangSanPham, sanPham];

    LuuVaoLocalStorage();
    HienThi(mangSanPham);
}

const HienThi = (mangHienThi) => {
    const table = getEle("tblDanhSachSanPham");
    let content = "";
    for (let sanPham of mangHienThi) {
        content += `
            <tr>
                <td>${sanPham.maSP}</td>
                <td>${sanPham.tenSP}</td>
                <td>${sanPham.giaSP}</td>
                <td>
                    <img src="${sanPham.hinhAnhSP}" alt="sanPham" width="40px" height="30px"/>
                </td>
                <td>
                    <button class="btn btn-danger" data-id="${sanPham.maSP}" onClick="XoaSanPham(event)">Xóa</button>
                    <button class="btn btn-warning" data-id="${sanPham.maSP}" onClick="HienThiThongTinSP(event)">Sửa</button>
                    <button class="btn btn-primary" data-id="${sanPham.maSP}" onClick="XemChiTietSP(event)">Xem chi tiết sản phẩm</button>
                </td>
            </tr>
        `
    }
    table.innerHTML = content;
}

const XoaSanPham = (e) => {
    const id = e.target.getAttribute("data-id");
    mangSanPham = mangSanPham.filter((sanPham) => {
        return sanPham.maSP !== id;
    });
    LuuVaoLocalStorage();
    HienThi(mangSanPham);
}

const LuuVaoLocalStorage = () => {
    let jsonData = JSON.stringify(mangSanPham);
    localStorage.setItem("mangSanPham", jsonData);
}

const LayVaoLocalStorage = () => {
    let jsonData = localStorage.getItem("mangSanPham");
    if (!jsonData) {
        mangSanPham = [];
        return;
    }
    mangSanPham = JSON.parse(jsonData);

    HienThi(mangSanPham);
}

LayVaoLocalStorage();

//Cap nhat
const HienThiThongTinSP = (e) => {
    const id = e.target.getAttribute("data-id");

    const sanPhamDuocChon = mangSanPham.find((sanPham) => sanPham.maSP === id);

    getEle("maSP").value = sanPhamDuocChon.maSP;
    getEle("tenSP").value = sanPhamDuocChon.tenSP;
    getEle("gia").value = sanPhamDuocChon.giaSP;
    getEle("hinhAnh").value = sanPhamDuocChon.hinhAnhSP;

    getEle("maSP").setAttribute("disabled", true);
}

const CapNhatSanPham = () => {
    var sanPhamMoi = LayThongTin();

    const index = mangSanPham.findIndex((sanPham) => sanPham.maSP === sanPhamMoi.maSP);
    mangSanPham[index] = sanPhamMoi;
    LuuVaoLocalStorage();
    HienThi(mangSanPham);
}

//Gio hang

//Xem chi tiet san pham
const XemChiTietSP = (e) => {
    const id = e.target.getAttribute("data-id");
    window.open(`./index.html?idSanPham=${id}`, "blank");
}

//Goi ham
getEle("btnThem").addEventListener("click", ThemSanPham);
getEle("btnCapNhat").addEventListener("click", CapNhatSanPham);