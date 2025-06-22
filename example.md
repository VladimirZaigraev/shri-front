# Примеры использования Button компонентов

## Button (текстовые кнопки)

```tsx
import { Button } from '@/ui';

// Базовое использование
<Button>Нажми меня</Button>

// С разными цветами
<Button color="green">Зеленая кнопка</Button>
<Button color="orange">Оранжевая кнопка</Button>
<Button color="black">Черная кнопка</Button>

// Отключенная кнопка
<Button disabled>Отключена</Button>

// Submit кнопка
<Button type="submit" color="green">Отправить</Button>
```

## IconButton (иконочные кнопки)

```tsx
import { IconButton } from '@/ui';

// Базовое использование (ariaLabel обязателен!)
<IconButton
  icon="mage-upload"
  size="md"
  ariaLabel="Загрузить файл"
/>

// С разными цветами и размерами
<IconButton
  icon="metric-job"
  size="sm"
  color="orange"
  ariaLabel="Открыть метрики"
/>

<IconButton
  icon="proicons-cancel"
  size="lg"
  color="black"
  ariaLabel="Отменить действие"
/>

// Отключенная иконочная кнопка
<IconButton
  icon="solar-history"
  size="md"
  disabled
  ariaLabel="История (недоступна)"
/>
```

## Ключевые улучшения

✅ **Разделение ответственности**: `Button` для текста, `IconButton` для иконок  
✅ **Accessibility**: обязательный `ariaLabel` для иконочных кнопок  
✅ **Type Safety**: правильная типизация без `non-null assertions`  
✅ **Hover/Focus состояния**: полная поддержка интерактивных состояний  
✅ **Единообразный API**: одинаковые цвета и поведение
