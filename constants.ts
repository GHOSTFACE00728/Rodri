import { CranialNerve } from './types';

export const CRANIAL_NERVES: CranialNerve[] = [
  { id: 1, roman: 'I', name: 'Olfatório', functionType: 'Sensorial', description: 'Responsável pelo olfato.', keyFunction: 'Olfato' },
  { id: 2, roman: 'II', name: 'Óptico', functionType: 'Sensorial', description: 'Transmite impulsos visuais.', keyFunction: 'Visão' },
  { id: 3, roman: 'III', name: 'Oculomotor', functionType: 'Motor', description: 'Controla a maioria dos movimentos oculares e constrição pupilar.', keyFunction: 'Movimento dos olhos' },
  { id: 4, roman: 'IV', name: 'Troclear', functionType: 'Motor', description: 'Inerva o músculo oblíquo superior do olho.', keyFunction: 'Movimento ocular (baixo/dentro)' },
  { id: 5, roman: 'V', name: 'Trigêmeo', functionType: 'Misto', description: 'Sensibilidade da face e músculos da mastigação.', keyFunction: 'Sensação facial / Mastigação' },
  { id: 6, roman: 'VI', name: 'Abducente', functionType: 'Motor', description: 'Inerva o músculo reto lateral (abdução do olho).', keyFunction: 'Movimento ocular (lateral)' },
  { id: 7, roman: 'VII', name: 'Facial', functionType: 'Misto', description: 'Expressão facial, paladar (2/3 anteriores da língua).', keyFunction: 'Expressão facial' },
  { id: 8, roman: 'VIII', name: 'Vestibulococlear', functionType: 'Sensorial', description: 'Audição e equilíbrio.', keyFunction: 'Audição e Equilíbrio' },
  { id: 9, roman: 'IX', name: 'Glossofaríngeo', functionType: 'Misto', description: 'Deglutição, paladar (1/3 posterior), reflexo de vômito.', keyFunction: 'Deglutição / Paladar' },
  { id: 10, roman: 'X', name: 'Vago', functionType: 'Misto', description: 'Controle parassimpático de órgãos viscerais, fala.', keyFunction: 'Vísceras / Fonação' },
  { id: 11, roman: 'XI', name: 'Acessório', functionType: 'Motor', description: 'Movimento do pescoço e ombros (esternocleidomastoideo/trapézio).', keyFunction: 'Movimento ombro/pescoço' },
  { id: 12, roman: 'XII', name: 'Hipoglosso', functionType: 'Motor', description: 'Movimentos da língua.', keyFunction: 'Movimento da língua' },
];