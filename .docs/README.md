# 📚 Documentation

Thư mục này chứa các tài liệu hướng dẫn và reference cho dự án Admin Manga v3.

## 📖 Tài liệu có sẵn

### ⚡ Quick Solutions

1. **[SOLUTION-modal-dropdown-onselect.md](./SOLUTION-modal-dropdown-onselect.md)** ⭐
   - **ROOT CAUSE FOUND!** Modal không hiển thị do dùng `click` thay vì `onSelect`
   - Giải thích chi tiết về DropdownMenu API trong Nuxt UI v4
   - Migration guide từ v3 sang v4

### Debugging Guides

2. **[debug-modal-not-showing.md](./debug-modal-not-showing.md)**
   - Hướng dẫn debug khi Modal không hiển thị
   - Console logging strategies
   - Common issues và solutions
   - Step-by-step debugging process

## 🎯 Mục đích

Các tài liệu này được tạo ra để:

- ✅ Giúp team hiểu và sử dụng Nuxt UI v4 hiệu quả
- ✅ Tránh các lỗi phổ biến khi migrate từ v3 sang v4
- ✅ Cung cấp reference nhanh khi coding
- ✅ Debug các vấn đề một cách có hệ thống

## 📝 Cách sử dụng

### Khi bắt đầu với Nuxt UI v4

1. Đọc **nuxt-ui-v4-quick-reference.md** để hiểu tổng quan
2. Tham khảo **nuxt-ui-v4-modal-guide.md** khi làm việc với Modal/Dialog

### Khi gặp vấn đề

1. Kiểm tra **Troubleshooting** section trong quick reference
2. Nếu là vấn đề về Modal, xem **debug-modal-not-showing.md**
3. Follow debug checklist và logging strategies

### Khi implement feature mới

1. Search trong **nuxt-ui-v4-quick-reference.md** cho component cần dùng
2. Copy pattern phù hợp
3. Customize theo nhu cầu

## 🔗 External Resources

### Nuxt UI Official Docs
- **Documentation**: https://ui.nuxt.com/
- **Components**: https://ui.nuxt.com/docs/components
- **Migration Guide**: https://ui.nuxt.com/docs/getting-started/migration/v4
- **GitHub**: https://github.com/nuxt/ui

### Icon Resources
- **Lucide Icons**: https://lucide.dev/icons/
- **Heroicons**: https://heroicons.com/
- **Iconify**: https://icon-sets.iconify.design/

### Other Useful Links
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix Vue** (underlying primitives): https://www.radix-vue.com/
- **Vue 3 Docs**: https://vuejs.org/

## 🤝 Contributing to Docs

Khi thêm tài liệu mới:

1. **Sử dụng Markdown** với proper formatting
2. **Thêm emojis** để dễ scan
3. **Include code examples** với comments
4. **Update README này** để list tài liệu mới
5. **Use clear headings** và table of contents nếu cần

### Template cho tài liệu mới:

```markdown
# 📌 [Title]

## 🎯 Mục đích
Brief description of what this doc covers

## 📚 Nội dung
Main content with examples

## ✅ Checklist / Best Practices
Actionable items

## 🔗 Related Resources
Links to related docs or external resources
```

## 📅 Maintenance

- Review và update docs khi có breaking changes
- Thêm examples mới khi discover patterns hay
- Fix typos và improve clarity based on feedba
