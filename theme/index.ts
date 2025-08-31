// src/theme/index.ts
export const theme = {
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      background: '#0A0E27',
      surface: '#1A1F3A',
      card: '#242B47',
      text: '#FFFFFF',
      textSecondary: '#B4B9D2',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FFC107',
      
      // Utility type colors
      smoke: '#9E9E9E',
      flash: '#FFEB3B',
      molotov: '#FF5722',
      grenade: '#8BC34A',
      
      // Team colors
      t: '#C9A961',
      ct: '#5B92C9',
    },
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      round: 9999,
    },
    
    typography: {
      h1: {
        fontSize: 32,
        fontWeight: '700' as const,
      },
      h2: {
        fontSize: 24,
        fontWeight: '600' as const,
      },
      h3: {
        fontSize: 20,
        fontWeight: '600' as const,
      },
      body: {
        fontSize: 16,
        fontWeight: '400' as const,
      },
      caption: {
        fontSize: 14,
        fontWeight: '400' as const,
      },
      small: {
        fontSize: 12,
        fontWeight: '400' as const,
      },
    },
  };