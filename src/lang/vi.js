export default {
  route: {
    dashboard: 'Bảng điều khiển',
    permission: 'Quyền hạn',
    pagePermission: 'Quyền Trang',
    rolePermission: 'Quyền vai trò',
    directivePermission: 'Giấy phép Chỉ thị',
    icons: 'Biểu tượng',
    components: 'Các thành phần',
    tinymce: 'Tinymce',
    markdown: 'Đánh dấu',
    jsonEditor: 'Trình chỉnh sửa JSON',
    dndList: 'Danh sách Dnd',
    splitPane: 'SplitPane',
    avatarUpload: 'Tải lên Hình đại diện',
    dropzone: 'Vùng Loại',
    sticky: 'Dính',
    countTo: 'Đếm đến',
    componentMixin: 'Mixin',
    backToTop: 'Trở lại đầu trang',
    dragDialog: 'Hộp thoại Kéo',
    dragSelect: 'Kéo Chọn',
    dragKanban: 'Kéo Kanban',
    Table: 'Bảng',
    dynamicTable: 'Bảng động',
    dragTable: 'Bảng kéo',
    inlineEditTable: 'Chỉnh sửa nội tuyến',
    complexTable: 'Bảng phức tạp',
    createArticle: 'Tạo bài viết',
    editArticle: 'Chỉnh sửa bài viết',
    articleList: 'Danh sách bài viết',
    excel: 'Excel',
    exportExcel: 'Xuất Excel',
    selectExcel: 'Xuất khẩu đã chọn',
    mergeHeader: 'Hợp nhất tiêu đề',
    uploadExcel: 'Tải lên Excel',
    clipboardDemo: 'Bộ nhớ tạm',
    externalLink: 'Liên kết ngoài'
  },
  navbar: {
    logOut: 'Đăng xuất',
    profile: 'Trang cá nhân',
    theme: 'Chủ đề',
    size: 'Cỡ chữ'
  },
  login: {
    title: 'Đăng nhập hệ thống',
    logIn: 'Đăng nhập',
    username: 'Tài khoản',
    password: 'Mật khẩu'
  },
  permission: {
    addRole: 'Vai trò mới',
    editPermission: 'Chỉnh sửa',
    roles: 'Vai trò của bạn',
    switchRoles: 'Đổi vai trò',
    tips: 'Trong một số trường hợp, việc sử dụng quyền v sẽ không có tác dụng. Ví dụ: Phần tử-UI el-tab hoặc el-table-column và các cảnh khác hiển thị động dom. Bạn chỉ có thể làm điều này với v-if. ',
    delete: 'Xóa bỏ',
    confirm: 'Xác nhận',
    cancel: 'Hủy bỏ'
  },
  components: {
    documentation: 'Documentation',
    tinymceTips: 'Rich text is a core feature of the management backend, but at the same time it is a place with lots of pits. In the process of selecting rich texts, I also took a lot of detours. The common rich texts on the market have been basically used, and I finally chose Tinymce. See the more detailed rich text comparison and introduction.',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Tiêu đề cố định, được sắp xếp theo thứ tự tiêu đề',
    dynamicTips2: 'Tiêu đề không cố định, được sắp xếp theo thứ tự nhấp chuột',
    dragTips1: 'Thứ tự mặc định',
    dragTips2: 'Lệnh sau khi kéo',
    title: 'Tiêu đề',
    importance: 'Imp',
    type: 'Loại hình',
    remark: 'Nhận xét',
    search: 'Tìm kiếm',
    add: 'Cộng',
    export: 'Xuất khẩu',
    reviewer: 'người đánh giá',
    id: 'TÔI',
    date: 'Ngày',
    author: 'Tác giả',
    readings: 'Bài đọc',
    status: 'Trạng thái',
    actions: 'Hành động',
    edit: 'Chỉnh sửa',
    publish: 'Công bố',
    draft: 'Bản thảo',
    delete: 'Xóa bỏ',
    cancel: 'Hủy bỏ',
    confirm: 'Xác nhận'
  },
  example: {
    warning: 'Lưu ý, xem thêm: '
  },
  excel: {
    export: 'Xuất',
    selectedExport: 'Xuất các hàng đã chọn',
    placeholder: 'Vui lòng nhập tên tệp'
  },
  tagsView: {
    refresh: 'Làm mới',
    close: 'Đóng',
    closeOthers: 'Đóng các tab khác',
    closeAll: 'Đóng tất cả'
  },
  settings: {
    title: 'Cài đặt trang',
    theme: 'Màu chủ đề',
    tagsView: 'Hiện thị tab',
    fixedHeader: 'Cố định header',
    sidebarLogo: 'Hiện logo sidebar'
  }
}
