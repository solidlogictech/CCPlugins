# Expand UI Components

I'll analyze existing UI component patterns and create similar components following your established conventions, maintaining consistency in structure, styling, props, and behavior patterns.

Arguments: `$ARGUMENTS` - component pattern, component name, or UI focus area

## Session Intelligence

I'll maintain component expansion progress across sessions:

**Session Files (in current project directory):**
- `expand-components/analysis.md` - Component pattern analysis and expansion plan
- `expand-components/state.json` - Expansion progress and generated components

**IMPORTANT:** Session files are stored in an `expand-components` folder in your current project root

**Auto-Detection:**
- If session exists: Resume component expansion
- If no session: Create new component analysis
- Commands: `resume`, `patterns`, `components`

## Phase 1: Component Pattern Discovery & Analysis

**MANDATORY FIRST STEPS:**
1. Check if `expand-components` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `expand-components/state.json`
   - Look for `expand-components/analysis.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze existing component patterns and structure
   - Identify UI framework and styling conventions
   - Create component expansion plan
4. Show component analysis summary before expansion

**Component Pattern Discovery:**
- Use **Glob** to find component files, styles, and tests
- Use **Read** to analyze existing component implementations
- Use **Grep** to identify component patterns, props, and state management
- Analyze component documentation and style guides

## Phase 2: Framework & Convention Detection

I'll identify your UI architecture and conventions:

**Framework Detection:**
- UI framework (React, Vue, Angular, Svelte, etc.)
- Component structure and organization patterns
- State management approach (Redux, Context, Vuex, etc.)
- Styling approach (CSS Modules, Styled Components, Tailwind, etc.)

**Convention Analysis:**
- Component naming and file organization
- Props interface and validation patterns
- Event handling and callback conventions
- Styling and theming approaches
- Testing patterns for components

## Phase 3: Component Pattern Analysis

I'll analyze existing components to understand patterns:

**Pattern Identification:**
- Component composition and reusability patterns
- Props interface design and validation
- State management and lifecycle patterns
- Styling and responsive design approaches
- Accessibility and user interaction patterns

**Component Expansion Planning:**
I'll create `expand-components/analysis.md` with:

```markdown
# Component Expansion Analysis

## Current Component Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Styled Components with theme provider
- **State**: React Context + useReducer for complex state
- **Testing**: React Testing Library with Jest

## Existing Component Patterns

### File Structure
```
src/components/
├── Button/
│   ├── Button.tsx
│   ├── Button.styles.ts
│   ├── Button.test.tsx
│   ├── Button.stories.tsx
│   └── index.ts
├── Input/
│   ├── Input.tsx
│   ├── Input.styles.ts
│   ├── Input.test.tsx
│   └── index.ts
```

### Component Structure Pattern
```typescript
// Button.tsx
import React from 'react';
import { StyledButton } from './Button.styles';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  'data-testid'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  children,
  onClick,
  'data-testid': testId,
  ...rest
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={handleClick}
      data-testid={testId}
      {...rest}
    >
      {loading ? <LoadingSpinner size="small" /> : children}
    </StyledButton>
  );
};

Button.displayName = 'Button';
```

### Styling Pattern
```typescript
// Button.styles.ts
import styled, { css } from 'styled-components';
import { ButtonProps } from './Button';

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryLight};
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.danger};
  `
};

const sizeStyles = {
  small: css`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  `,
  medium: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  `,
  large: css`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  `
};

export const StyledButton = styled.button<Pick<ButtonProps, 'variant' | 'size'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  ${({ variant = 'primary' }) => variantStyles[variant]}
  ${({ size = 'medium' }) => sizeStyles[size]}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;
```

### Testing Pattern
```typescript
// Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Button } from './Button';
import { theme } from '../../theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Button', () => {
  it('should render with default props', () => {
    renderWithTheme(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });
  
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

## Expansion Opportunities

### Missing Form Components
1. **Select Component** - Following Button/Input pattern
   - **Props**: options, value, onChange, placeholder, disabled, error
   - **Variants**: single, multi-select
   - **Styling**: Consistent with existing form components

2. **Checkbox Component** - Following form component pattern
   - **Props**: checked, onChange, label, disabled, error
   - **Styling**: Theme-consistent styling
   - **Accessibility**: Proper ARIA attributes

3. **Radio Component** - Following checkbox pattern
   - **Props**: name, value, checked, onChange, label, disabled
   - **Group**: RadioGroup wrapper component
   - **Styling**: Consistent with other form controls

### Missing Layout Components
1. **Card Component** - Following container pattern
   - **Props**: variant, padding, shadow, border
   - **Composition**: Header, Body, Footer slots
   - **Responsive**: Mobile-first responsive design

2. **Modal Component** - Following overlay pattern
   - **Props**: isOpen, onClose, size, closeOnOverlay
   - **Accessibility**: Focus management, escape key handling
   - **Animation**: Consistent with existing transitions

### Missing Data Display Components
1. **Table Component** - Following data component pattern
   - **Props**: columns, data, sortable, pagination
   - **Features**: Sorting, filtering, row selection
   - **Responsive**: Mobile-friendly responsive table

## Generated Component Examples

### Select Component
```typescript
// Select.tsx - Following Button/Input pattern
import React from 'react';
import { StyledSelect, StyledOption } from './Select.styles';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string) => void;
  'data-testid'?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder = 'Select an option',
  disabled = false,
  error,
  onChange,
  'data-testid': testId,
  ...rest
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!disabled && onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <StyledSelect
      value={value || ''}
      disabled={disabled}
      hasError={!!error}
      onChange={handleChange}
      data-testid={testId}
      {...rest}
    >
      <StyledOption value="" disabled>
        {placeholder}
      </StyledOption>
      {options.map((option) => (
        <StyledOption
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </StyledOption>
      ))}
    </StyledSelect>
  );
};

Select.displayName = 'Select';
```

## Expansion Plan

### Phase 1: Core Form Components
- [ ] Generate Select component following form pattern
- [ ] Create Checkbox component with consistent styling
- [ ] Add Radio and RadioGroup components
- [ ] Create TextArea component following Input pattern

### Phase 2: Layout Components
- [ ] Generate Card component with composition slots
- [ ] Create Modal component with accessibility features
- [ ] Add Grid and Flex layout components
- [ ] Implement responsive Container component

### Phase 3: Data Display Components
- [ ] Create Table component with sorting and pagination
- [ ] Add List component with various item types
- [ ] Generate Badge and Tag components
- [ ] Create Progress and Loading components

### Phase 4: Testing & Documentation
- [ ] Generate comprehensive tests for all components
- [ ] Create Storybook stories following existing pattern
- [ ] Update component documentation
- [ ] Add accessibility testing and validation
```

## Phase 4: Component Generation Following Patterns

I'll generate new components matching your established patterns:

**Pattern Matching:**
- Follow existing file structure and naming conventions
- Use same TypeScript interfaces and prop patterns
- Match styling approach and theme integration
- Maintain consistent testing and documentation patterns

**Code Generation:**
- Generate component files following existing structure
- Create styled components using same styling patterns
- Add TypeScript interfaces with proper prop validation
- Include comprehensive tests following existing test patterns

## Phase 5: Integration & Documentation

I'll ensure new components integrate with existing component library:

**Integration Verification:**
- Verify components work with existing theme system
- Ensure proper TypeScript integration and type checking
- Check component composition and reusability
- Validate accessibility and responsive behavior

**Documentation Updates:**
- Create Storybook stories for new components
- Generate component documentation and usage examples
- Update component library index and exports
- Add design system documentation updates

## Context Continuity

**Session Resume:**
When you return and run `/expand-components` or `/expand-components resume`:
- Load existing component analysis and expansion progress
- Show generated components and remaining work
- Continue expansion from last point
- Maintain all pattern analysis and decisions

**Progress Example:**
```
RESUMING COMPONENT EXPANSION SESSION
├── Pattern: React + Styled Components + TypeScript
├── Generated: 6 of 10 planned components
├── Current: Table component with sorting
└── Next: Modal component with accessibility

Continuing component expansion...
```

## Practical Examples

**Expand Components:**
```
/expand-components Select        # Create select component
/expand-components "form inputs" # Generate form input components
/expand-components Card          # Create card layout component
```

**Analysis Commands:**
```
/expand-components patterns    # Analyze existing component patterns
/expand-components missing     # Show missing component opportunities
/expand-components docs        # Focus on documentation updates
```

## Integration with Development Workflow

**Component Development:**
- Follow existing development and testing patterns
- Maintain design system consistency and theming
- Ensure proper accessibility and responsive design
- Include comprehensive testing and documentation

**Quality Assurance:**
- Generate tests following existing test patterns
- Validate component accessibility and usability
- Check responsive design and cross-browser compatibility
- Ensure proper TypeScript integration and type safety

## Safety Guarantees

**Protection Measures:**
- Generate components following existing patterns exactly
- Ensure new components don't break existing component library
- Validate theme integration and styling consistency
- Maintain accessibility and responsive design standards

**Important:** I will NEVER:
- Modify existing components without explicit request
- Generate components that don't follow project patterns
- Create components that break design system consistency
- Add AI attribution to component code or documentation

## Command Integration

After component expansion, I may suggest:
- `/test` - To run component tests
- `/review` - To validate component quality and accessibility
- `/docs` - To update component documentation
- `/commit` - To save component improvements

## What I'll Actually Do

1. **Analyze patterns** - Understand existing component structure and conventions
2. **Identify opportunities** - Find missing components and UI patterns
3. **Generate systematically** - Create components following established patterns
4. **Integrate seamlessly** - Ensure compatibility with existing component library
5. **Document thoroughly** - Update component documentation and stories
6. **Track progress** - Monitor expansion progress and quality

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of component analysis and expansion progress.