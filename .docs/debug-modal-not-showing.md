# 🔍 Debug Guide - Modal không hiển thị

## Các bước debug đã thực hiện

### 1. Thêm Debug Logging

Tôi đã thêm các console.log vào component để track flow:

```vue
<script setup>
// Watch deleteModal state changes
watch(deleteModal, (newValue) => {
  console.log('🟢 deleteModal changed to:', newValue)
})

function openDeleteModal(chapter: Chapter) {
  console.log('🔴 openDeleteModal called with:', chapter)
  chapterToDelete.value = chapter
  deleteModal.value = true
  console.log('🔴 deleteModal state:', deleteModal.value)
  console.log('🔴 chapterToDelete:', chapterToDelete.value)
}

// In dropdown click handler
click: () => {
  console.log('🟡 Dropdown click triggered for:', row.original)
  openDeleteModal(row.original)
}
</script>
```

### 2. Kiểm tra trong Console

Mở browser console (F12) và thực hiện các bước:

1. **Click vào nút "..." (more actions)** trong table row
2. **Click vào "Xóa chapter"**
3. **Xem console logs**:

#### ✅ Trường hợp HOẠT ĐỘNG ĐÚNG:
Bạn sẽ thấy logs theo thứ tự:
```
🟡 Dropdown click triggered for: { id: 1, name: "Chapter 1", ... }
🔴 openDeleteModal called with: { id: 1, name: "Chapter 1", ... }
🔴 deleteModal state: true
🔴 chapterToDelete: { id: 1, name: "Chapter 1", ... }
🟢 deleteModal changed to: true
```

#### ❌ Trường hợp CÓ VẤN ĐỀ:

**Scenario A: Không có log nào**
```
(không có log gì cả)
```
**→ Nguyên nhân:** Dropdown click handler không được gọi
**→ Fix:** Kiểm tra UDropdownMenu items structure

**Scenario B: Chỉ có log dropdown, không có log openDeleteModal**
```
🟡 Dropdown click triggered for: { ... }
```
**→ Nguyên nhân:** Function openDeleteModal không được gọi hoặc có lỗi
**→ Fix:** Kiểm tra binding và error trong console

**Scenario C: Có tất cả logs nhưng modal vẫn không hiện**
```
🟡 Dropdown click triggered for: { ... }
🔴 openDeleteModal called with: { ... }
🔴 deleteModal state: true
🔴 chapterToDelete: { ... }
🟢 deleteModal changed to: true
```
**→ Nguyên nhân:** Modal component không render hoặc bị ẩn (CSS/z-index)
**→ Fix:** Kiểm tra Modal component syntax và z-index

### 3. Kiểm tra Element trong DOM

Mở DevTools Elements tab:

1. **Tìm modal element:**
   - Search cho `[role="dialog"]` hoặc class của UModal
   - Kiểm tra xem element có tồn tại trong DOM không

2. **Nếu tồn tại nhưng không hiển thị:**
   - Check computed styles
   - Xem `display`, `opacity`, `visibility`, `z-index`

3. **Nếu không tồn tại:**
   - Modal component không được render
   - Kiểm tra syntax và condition

### 4. Các vấn đề phổ biến

#### Issue 1: DropdownMenu click không hoạt động

**Kiểm tra:**
```vue
<!-- ❌ SAI -->
<UDropdownMenu :items="[
  {
    label: 'Delete',
    onClick: () => handleDelete() // ← Sai prop name
  }
]" />

<!-- ✅ ĐÚNG -->
<UDropdownMenu :items="[
  [{
    label: 'Delete',
    click: () => handleDelete() // ← Đúng prop name
  }]
]" />
```

#### Issue 2: Modal v-model binding sai

**Kiểm tra:**
```vue
<!-- ❌ SAI - Nuxt UI v4 không support -->
<UModal v-model="deleteModal">
</UModal>

<!-- ✅ ĐÚNG - Nuxt UI v4 -->
<UModal v-model:open="deleteModal">
</UModal>
```

#### Issue 3: Modal structure sai

**Kiểm tra:**
```vue
<!-- ❌ SAI - Thiếu slots -->
<UModal v-model:open="isOpen">
  <div>Content</div>
</UModal>

<!-- ✅ ĐÚNG - Có đầy đủ slots -->
<UModal v-model:open="isOpen">
  <template #header>Header</template>
  <template #body>Body</template>
  <template #footer>Footer</template>
</UModal>
```

#### Issue 4: Z-index / Stacking context

**Kiểm tra parent containers:**
```vue
<!-- ❌ SAI - Modal nằm trong container có z-index thấp -->
<div class="relative z-10">
  <UTable ... />
  <UModal ... /> <!-- ← Bị giới hạn bởi parent z-index -->
</div>

<!-- ✅ ĐÚNG - Modal nằm ở root level hoặc portal -->
<div>
  <div class="relative z-10">
    <UTable ... />
  </div>
  <UModal ... /> <!-- ← Có thể có z-index riêng -->
</div>
```

### 5. Debugging với Vue DevTools

1. **Cài đặt Vue DevTools** (nếu chưa có)
2. **Mở Vue tab** trong DevTools
3. **Tìm component `MangaChaptersTable`**
4. **Kiểm tra state:**
   - `deleteModal` - phải là `true` khi modal should show
   - `chapterToDelete` - phải có data của chapter cần xóa
5. **Thử manually set state:**
   - Click vào component trong DevTools
   - Set `deleteModal = true` manually
   - Xem modal có hiện không

## 🛠️ Temporary Test Modal

Để test xem Modal component có hoạt động không, thêm test modal đơn giản:

```vue
<template>
  <div>
    <!-- Test button -->
    <UButton 
      label="🧪 Test Modal" 
      @click="testModal = true"
      class="mb-4"
    />
    
    <!-- Test modal -->
    <UModal v-model:open="testModal">
      <template #header>
        <h3>Test Modal</h3>
      </template>
      <template #body>
        <p>If you see this, Modal component works!</p>
      </template>
      <template #footer>
        <UButton label="Close" @click="testModal = false" />
      </template>
    </UModal>
    
    <!-- Your existing table -->
    <UTable ... />
  </div>
</template>

<script setup>
const testModal = ref(false)
// ... existing code
</script>
```

**Nếu test modal hoạt động:**
→ Vấn đề nằm ở dropdown click handler hoặc state management

**Nếu test modal KHÔNG hoạt động:**
→ Vấn đề nằm ở UModal component hoặc Nuxt UI setup

## 🔧 Quick Fixes

### Fix 1: Ensure proper UModal import

```typescript
// Kiểm tra trong app.vue hoặc nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  // ...
})
```

### Fix 2: Check Nuxt UI version

```bash
cat package.json | grep "@nuxt/ui"
```

Should be v4.x.x

### Fix 3: Clear cache and rebuild

```bash
# Clear Nuxt cache
rm -rf .nuxt node_modules/.cache

# Reinstall
pnpm install

# Rebuild
pnpm dev
```

### Fix 4: Alternative Modal approach

Nếu `v-model:open` không hoạt động, thử cách khác:

```vue
<script setup>
const { isOpen } = useModal()

function openDeleteModal(chapter: Chapter) {
  chapterToDelete.value = chapter
  isOpen('delete-modal', true)
}
</script>

<template>
  <UModal name="delete-modal">
    <!-- ... -->
  </UModal>
</template>
```

## 📊 Checklist Debug

- [ ] Console logs hiển thị khi click dropdown?
- [ ] `openDeleteModal` function được gọi?
- [ ] `deleteModal` state đổi thành `true`?
- [ ] Modal element tồn tại trong DOM?
- [ ] Modal có `display: none` hoặc `opacity: 0`?
- [ ] Z-index của modal có đủ cao không?
- [ ] Test modal đơn giản có hoạt động không?
- [ ] Nuxt UI version có đúng v4 không?
- [ ] Có error nào trong browser console không?
- [ ] Vue DevTools shows correct state?

## 🎯 Expected Results

Sau khi debug với logs, bạn sẽ biết chính xác:

1. **Dropdown click có hoạt động không** → Log 🟡
2. **Function có được gọi không** → Log 🔴
3. **State có thay đổi không** → Log 🟢
4. **Modal có render không** → Check DOM

Hãy chạy lại app và thực hiện thao tác xóa, sau đó gửi cho tôi:
- **Console logs** (screenshot hoặc copy text)
- **Network tab** có error không
- **Vue DevTools state** của component

Với thông tin đó tôi sẽ biết chính xác vấn đề là gì! 🚀
