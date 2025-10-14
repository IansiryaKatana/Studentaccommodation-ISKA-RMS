# 🎨 LOGIN PAGE COLOR CONFIGURATION

## 📍 **Where Colors Are Set**

The login page colors are **NOT hardcoded** - they use CSS variables defined in `src/index.css` and applied through Tailwind CSS classes.

---

## 🔵 **Button Colors**

### **Location:** `src/components/ui/button.tsx`

The "Sign In" button uses the `default` variant:
```typescript
variant: {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  // ... other variants
}
```

### **CSS Variables Used:**
- **Background Color:** `--primary` 
- **Text Color:** `--primary-foreground`
- **Hover State:** Same as background but at 90% opacity

### **Defined In:** `src/index.css` (Lines 15-16)
```css
:root {
  --primary: 221.2 83.2% 53.3%;           /* Blue color (HSL format) */
  --primary-foreground: 210 40% 98%;      /* White/light text */
  --ring: 221.2 83.2% 53.3%;              /* Focus ring (same as primary) */
}
```

**Current Color:**
- `--primary` = `hsl(221.2, 83.2%, 53.3%)` = **Blue (#3B7AEE)**
- `--primary-foreground` = `hsl(210, 40%, 98%)` = **Near White (#F8FAFC)**

---

## 🟦 **Input Field Focus Color**

### **Location:** `src/components/ui/input.tsx`

The input fields (email & password) use this class:
```typescript
"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### **CSS Variables Used:**
- **Focus Ring Color:** `--ring`
- **Ring Offset:** `--ring-offset-background` (uses `--background`)

### **Defined In:** `src/index.css` (Line 27)
```css
:root {
  --ring: 221.2 83.2% 53.3%;              /* Same as primary - Blue */
}
```

**Current Color:**
- `--ring` = `hsl(221.2, 83.2%, 53.3%)` = **Blue (#3B7AEE)**

---

## 🎯 **How to Change Colors**

### **Option 1: Edit CSS Variables (Global Change)**

**File:** `src/index.css` (Lines 15, 16, 27)

```css
:root {
  /* Change button background & focus ring */
  --primary: 221.2 83.2% 53.3%;          /* Change this HSL value */
  
  /* Change button text color */
  --primary-foreground: 210 40% 98%;     /* Change this HSL value */
  
  /* Change input focus ring */
  --ring: 221.2 83.2% 53.3%;             /* Change this HSL value */
}
```

**Example - Change to Green:**
```css
:root {
  --primary: 142 76% 36%;                /* Green button */
  --primary-foreground: 0 0% 100%;       /* White text */
  --ring: 142 76% 36%;                   /* Green focus ring */
}
```

**Example - Change to Purple:**
```css
:root {
  --primary: 262 83% 58%;                /* Purple button */
  --primary-foreground: 0 0% 100%;       /* White text */
  --ring: 262 83% 58%;                   /* Purple focus ring */
}
```

---

### **Option 2: Override in Login Page (Local Change)**

**File:** `src/pages/LoginPage.tsx`

Add inline styles to the Button component (Line 152):

```tsx
<Button
  type="submit"
  className="w-full"
  style={{
    backgroundColor: '#10B981',  // Custom green
    color: '#FFFFFF'
  }}
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Signing in...
    </>
  ) : (
    'Sign In'
  )}
</Button>
```

For input focus color, override in Input className (Lines 110, 125):
```tsx
<Input
  id="email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  disabled={isLoading}
  required
  className="w-full focus-visible:ring-green-500"  // Custom focus color
/>
```

---

## 📋 **Color Format Reference**

The CSS uses **HSL format** in Tailwind:
- Format: `H S% L%` (Hue Saturation Lightness)
- Example: `221.2 83.2% 53.3%` = Blue

### **Popular Colors in HSL:**

| Color | HSL Value | Hex |
|-------|-----------|-----|
| Blue (Current) | `221.2 83.2% 53.3%` | `#3B7AEE` |
| Green | `142 76% 36%` | `#16A34A` |
| Purple | `262 83% 58%` | `#9333EA` |
| Red | `0 72% 51%` | `#DC2626` |
| Orange | `25 95% 53%` | `#F97316` |
| Pink | `330 81% 60%` | `#EC4899` |
| Teal | `173 58% 39%` | `#14B8A6` |

---

## 🎨 **Current Login Page Color Scheme**

```
Background Gradient:
  - from-blue-50 to-indigo-100
  - Light blue to light indigo

Button (Sign In):
  - Background: #3B7AEE (Blue)
  - Text: #F8FAFC (White)
  - Hover: 90% opacity of blue

Input Fields:
  - Border: Light gray (#E2E8F0)
  - Focus Ring: #3B7AEE (Blue)
  - Background: White

Logo Gradient (if no logo):
  - Uses branding.primary_color & branding.secondary_color
  - Fallback: Blue to dark gray
```

---

## 🔧 **Where Each Element Gets Its Color**

### **Sign In Button:**
1. Component: `src/components/ui/button.tsx` (Line 12)
2. Uses: `bg-primary` and `text-primary-foreground`
3. Defined: `src/index.css` (Lines 15-16)

### **Input Focus Ring:**
1. Component: `src/components/ui/input.tsx` (Line 15)
2. Uses: `ring-ring`
3. Defined: `src/index.css` (Line 27)

### **Password Toggle Button (Eye icon):**
1. Component: `src/pages/LoginPage.tsx` (Line 135)
2. Uses: `variant="ghost"` from button.tsx (Line 19)
3. Hover color: `hover:bg-accent hover:text-accent-foreground`
4. Defined: `src/index.css` (Lines 21-22)

---

## ✅ **Summary**

**Colors are NOT hardcoded!**

They are set using CSS custom properties (variables) in:
- **File:** `src/index.css`
- **Lines:** 8-42 (`:root` section)

**Key Variables:**
- `--primary` = Button background & focus ring color
- `--primary-foreground` = Button text color
- `--ring` = Input focus ring color

**To Change:**
1. **Global:** Edit `src/index.css` (Lines 15, 16, 27)
2. **Local:** Override with inline styles or custom classes in `LoginPage.tsx`

All components use these CSS variables through Tailwind's `bg-primary`, `text-primary-foreground`, and `ring-ring` classes, making it easy to theme the entire application from one central location.


