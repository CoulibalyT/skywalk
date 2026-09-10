import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ServicesIndexPage from './ServicesIndexPage';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string, fallback?: string) => fallback ?? k }),
}));

vi.mock('../../../components/PageHeader', () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

function DummyIcon() {
  return <svg data-testid="icon" />;
}

vi.mock('../../../data/services-config', () => ({
  getServicesForIndex: () => [
    { id: 'emploi', title: 'Emploi', description: 'Find a job', icon: DummyIcon },
    { id: 'business', title: 'Business', description: 'Coming soon service', icon: DummyIcon, comingSoon: true },
  ],
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <ServicesIndexPage />
    </MemoryRouter>,
  );
}

describe('ServicesIndexPage', () => {
  it('renders a clickable card linking to the service page', () => {
    renderPage();
    const link = screen.getByText('Emploi').closest('a')!;
    expect(link).toHaveAttribute('href', '/services/emploi');
  });

  it('n’affiche plus les services « à venir » (retour de recette : on n’annonce pas ce qui n’existe pas)', () => {
    renderPage();
    expect(screen.queryByText('Business')).not.toBeInTheDocument();
    expect(screen.queryByText('À venir')).not.toBeInTheDocument();
  });
});
