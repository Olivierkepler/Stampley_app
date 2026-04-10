export interface Step {
    id: string;
    label: string;
    path: string;
  }
  
  export interface DomainCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    id: string;
  }