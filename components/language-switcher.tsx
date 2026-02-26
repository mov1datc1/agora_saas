'use client';

import { useState } from 'react';
import { messages, type Locale } from '@/i18n/messages';

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>('es');
  return (
    <div>
      <button onClick={() => setLocale('es')}>ES</button>
      <button onClick={() => setLocale('en')}>EN</button>
      <p>{messages[locale].heroTitle}</p>
    </div>
  );
}
