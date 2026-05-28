export interface Subject {
  id: string;
  name: string;
  category: 'Core' | 'Elective';
}

export const subjects: Subject[] = [
  // Core subjects (KEPT)
  { id: 'english-hl', name: 'English Home Language', category: 'Core' },
  { id: 'algebra', name: 'Algebra', category: 'Core' },
  { id: 'geometry', name: 'Geometry', category: 'Core' },

  // Elective subjects (KEPT - 7 subjects)
  { id: 'phys-sci', name: 'Physical Sciences', category: 'Elective' },
  { id: 'life-sci', name: 'Life Sciences', category: 'Elective' },
  { id: 'accounting', name: 'Accounting', category: 'Elective' },
  { id: 'business-studies', name: 'Business Studies', category: 'Elective' },
  { id: 'economics', name: 'Economics', category: 'Elective' },
  { id: 'cat', name: 'Computer Applications Technology', category: 'Elective' },
  { id: 'egd', name: 'Engineering Graphics and Design', category: 'Elective' },

  // REMOVED:
  // English First Additional
  // Afrikaans Home Language
  // Math Literacy
  // Life Orientation
  // History
  // Geography
  // Information Technology
  // Design
];
