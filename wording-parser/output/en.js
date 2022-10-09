export default {
    "route": {
        "dashboard": "Dashboard",
        "email": "Email",
        "proxy": "Proxy",
        "permission": "Permission",
        "pagePermission": "Page Permission",
        "rolePermission": "Role Permission",
        "directivePermission": "Directive Permission",
        "icons": "Icons",
        "components": "Components",
        "tinymce": "Tinymce",
        "markdown": "Markdown",
        "jsonEditor": "JSON Editor",
        "dndList": "Dnd List",
        "splitPane": "SplitPane",
        "avatarUpload": "Avatar Upload",
        "dropzone": "Dropzone",
        "sticky": "Sticky",
        "countTo": "Count To",
        "componentMixin": "Mixin",
        "backToTop": "Back To Top",
        "dragDialog": "Drag Dialog",
        "dragSelect": "Drag Select",
        "dragKanban": "Drag Kanban",
        "Table": "Table",
        "dynamicTable": "Dynamic Table",
        "dragTable": "Drag Table",
        "inlineEditTable": "Inline Edit",
        "complexTable": "Complex Table",
        "createArticle": "Create Article",
        "editArticle": "Edit Article",
        "articleList": "Article List",
        "excel": "Excel",
        "exportExcel": "Export Excel",
        "selectExcel": "Export Selected",
        "mergeHeader": "Merge Header",
        "uploadExcel": "Upload Excel",
        "clipboardDemo": "Clipboard",
        "externalLink": "External Link"
    },
    "navbar": {
        "logOut": "Log Out",
        "profile": "Profile",
        "theme": "Theme",
        "size": "Global Size"
    },
    "login": {
        "title": "Login Form",
        "logIn": "Login",
        "username": "Username",
        "password": "Password"
    },
    "tagsView": {
        "refresh": "Refresh",
        "close": "Close",
        "closeOthers": "Close Others",
        "closeAll": "Close All"
    },
    "settings": {
        "title": "Page style setting",
        "theme": "Theme Color",
        "tagsView": "Open Tags-View",
        "fixedHeader": "Fixed Header",
        "sidebarLogo": "Sidebar Logo"
    },
    "schedule": {
        "title": "Schedule"
    },
    "email": {
        "title": "Email",
        "search": "Enter the email address to search",
        "email": "Email",
        "password": "Password",
        "no": "ID",
        "actions": "Actions",
        "validate": {
            "username": "Please input correct email",
            "password": "Please input password"
        },
        "message": {
            "delete": {
                "title": "Do you want to delete email?"
            }
        }
    },
    "proxy": {
        "title": "Proxy"
    },
    "template": {
        "title": "Template"
    },
    "button": {
        "add": "Add",
        "update": "Update",
        "edit": "Edit",
        "delete": "Delete",
        "cancel": "Cancel",
        "confirm": "Confirm",
        "search": "Search",
        "export": "Export"
    },
    "dialog": {
        "create": "Create",
        "update": "Update"
    },
    "message": {
        "success": "Success",
        "fail": "Fail",
        "error": "Error",
        "confirm": "Confirm",
        "cancel": "Cancel"
    },
    "permission": {
        "addRole": "New Role",
        "editPermission": "Edit",
        "roles": "Your roles",
        "switchRoles": "Switch roles",
        "tips": "In some cases, using v-permission will have no effect. For example: Element-UI  el-tab or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.",
        "delete": "Delete",
        "confirm": "Confirm",
        "cancel": "Cancel"
    },
    "components": {
        "documentation": "Documentation",
        "tinymceTips": "Rich text is a core feature of the management backend, but at the same time it is a place with lots of pits. In the process of selecting rich texts, I also took a lot of detours. The common rich texts on the market have been basically used, and I finally chose Tinymce. See the more detailed rich text comparison and introduction.",
        "dropzoneTips": "Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.",
        "stickyTips": "when the page is scrolled to the preset position will be sticky on the top.",
        "backToTopTips1": "When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner",
        "backToTopTips2": "You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally",
        "imageUploadTips": "Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version."
    },
    "table": {
        "dynamicTips1": "Fixed header, sorted by header order",
        "dynamicTips2": "Not fixed header, sorted by click order",
        "dragTips1": "The default order",
        "dragTips2": "The after dragging order",
        "title": "Title",
        "importance": "Imp",
        "type": "Type",
        "remark": "Remark",
        "search": "Search",
        "add": "Add",
        "export": "Export",
        "reviewer": "reviewer",
        "id": "ID",
        "date": "Date",
        "author": "Author",
        "readings": "Readings",
        "status": "Status",
        "actions": "Actions",
        "edit": "Edit",
        "publish": "Publish",
        "draft": "Draft",
        "delete": "Delete",
        "cancel": "Cancel",
        "confirm": "Confirm"
    },
    "example": {
        "warning": "Creating and editing pages cannot be cached by keep-alive because keep-alive include does not currently support caching based on routes, so it is currently cached based on component name. If you want to achieve a similar caching effect, you can use a browser caching scheme such as localStorage. Or do not use keep-alive include to cache all pages directly. See details"
    },
    "excel": {
        "export": "Export",
        "selectedExport": "Export Selected Items",
        "placeholder": "Please enter the file name (default excel-list)"
    }
}