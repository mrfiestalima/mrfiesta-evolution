import type { Landing } from "../types/evolution";
const entries: [string, string, string, string, string[], string[]][] = [
  [
    "chicoteca-lima",
    "Chicoteca en Lima",
    "Música y baile para celebrar a tu manera.",
    "Una chicoteca reúne a tus invitados alrededor de la música. Elige un formato sin animación o una experiencia con dinámicas, según la edad y lo que disfrute tu grupo.",
    ["chicoteca", "home"],
    [
      "El ritmo lo pone tu grupo|Cuéntanos las edades, canciones favoritas y si prefieren bailar, cantar o participar en juegos. Esa información permite elegir el formato.",
      "Con o sin animación|Chicoteca es una opción sin animación. Chicoteca en Casa permite explorar un formato con animación y dinámicas. Confirma los incluidos de tu propuesta antes de reservar.",
    ],
  ],
  [
    "chicoteca-led-lima",
    "Chicoteca LED en Lima",
    "Pista, DJ y luces para darle otra dimensión a la fiesta.",
    "La pista LED cambia la presencia del montaje. Comparamos el espacio disponible, los accesos y la cantidad de invitados antes de proponer una configuración.",
    ["club-led", "led", "decoration"],
    [
      "La pista dentro del montaje|La iluminación y el espacio de baile deben funcionar juntos. Envía fotos del lugar para evaluar la distribución.",
      "Elige la producción|Club LED es un formato sin animación. Ultra Chicoteca LED y la alternativa con decoración permiten ampliar la experiencia; revisamos los incluidos contigo.",
    ],
  ],
  [
    "fiestas-infantiles-lima",
    "Fiestas infantiles en Lima",
    "Juegos, música y actividades para su etapa.",
    "La edad orienta la propuesta, pero no todos los niños disfrutan lo mismo. Elegimos entre juegos, baile, animación y Just Dance según sus intereses.",
    ["home", "neon"],
    [
      "Participar sin presión|Cuéntanos qué actividades disfruta tu hijo o hija y cómo es el grupo. La propuesta debe permitir participar y descansar.",
      "Un espacio que acompañe|La distribución debe separar el montaje de las zonas de paso. Revisamos el lugar antes de definir equipos y actividades.",
    ],
  ],
  [
    "fiestas-preadolescentes-lima",
    "Fiestas para preadolescentes en Lima",
    "Retos, karaoke y una pista para empezar a celebrar diferente.",
    "Entre los 9 y 11 años los intereses cambian rápido. Una mezcla de retos, baile y música permite armar una celebración sin imponer un formato infantil.",
    ["home", "neon", "led"],
    [
      "Escucha sus preferencias|Just Dance, competencias o karaoke pueden ser el centro. El recomendador ayuda a comparar alternativas con sus gustos.",
      "Un formato a su medida|La cantidad de invitados y el espacio importan tanto como la edad. Revisamos juntos la intensidad de la animación.",
    ],
  ],
  [
    "fiestas-adolescentes-lima",
    "Fiestas para adolescentes en Lima",
    "Más música. Más baile. Su propia forma de celebrar.",
    "Para una fiesta de 12 a 17 años, empieza por sus gustos: baile, karaoke, DJ, luces o pista LED. La animación se elige según el grupo.",
    ["chicoteca", "club-led", "led"],
    [
      "Baile y karaoke|Si quieren disfrutar la música sin animación infantil, compara Chicoteca y Club LED. Puedes consultar adicionales para personalizar el formato.",
      "Planea con ellos|Incluye al cumpleañero en la selección musical y define con la familia horarios, espacio y cantidad de invitados.",
    ],
  ],
  [
    "fiestas-15-anos-lima",
    "Fiestas de 15 años en Lima",
    "Una entrada a otra etapa, con música y producción.",
    "Diseñamos la propuesta alrededor de los momentos que quieren vivir: ingreso, baile, canciones y celebración con sus invitados.",
    ["club-led", "led", "decoration"],
    [
      "Momentos que necesitan coordinación|Comparte tu cronograma para revisar música, iluminación y requerimientos de cada momento.",
      "El lugar define la producción|El salón, los accesos y el espacio disponible orientan la propuesta de pista, DJ y decoración.",
    ],
  ],
  [
    "fiestas-adultos-lima",
    "Fiestas para adultos en Lima",
    "DJ, karaoke y producción para reunir a tu gente.",
    "Cumpleaños y reuniones pueden girar alrededor de una buena selección musical, karaoke o una pista iluminada. Cuéntanos el estilo de tu celebración.",
    ["chicoteca", "club-led"],
    [
      "Tu música, tu ambiente|Comparte géneros, canciones y momentos importantes. La propuesta puede priorizar baile o karaoke.",
      "Sin complicar la organización|Revisamos fecha, lugar, invitados y accesos para preparar una cotización con contexto.",
    ],
  ],
  [
    "eventos-colegios-lima",
    "Eventos para colegios en Lima",
    "Entretenimiento pensado para la comunidad educativa.",
    "Cada actividad escolar tiene un público distinto. Coordinamos la propuesta con la institución según edades, cantidad de asistentes y objetivos del encuentro.",
    [],
    [
      "Define el encuentro|Aniversarios, integraciones y celebraciones escolares necesitan un cronograma y actividades acordes con su público.",
      "Coordinación con el colegio|Comparte horarios, accesos, áreas disponibles y normas internas. La propuesta se revisa con el responsable de la institución.",
    ],
  ],
  [
    "eventos-corporativos-lima",
    "MR Fiesta Corporate",
    "ENTRETENIMIENTO × TECNOLOGÍA PARA EMPRESAS",
    "Integra música, interacción y producción en aniversarios, Family Day, activaciones y celebraciones de fin de año. Diseñamos la propuesta a partir del público y el objetivo del evento.",
    [],
    [
      "Un formato para cada objetivo|Una integración, un Family Day y una fiesta de fin de año necesitan ritmos diferentes. Definimos actividades y producción según la experiencia buscada.",
      "Producción coordinada|DJ, karaoke, pista LED, juegos interactivos y MR Fiesta Live pueden incorporarse a la propuesta. La disponibilidad y el alcance se confirman por evento.",
      "Información que ayuda a cotizar|Empresa, lugar, fecha, participantes y cronograma nos permiten evaluar una propuesta coherente con el espacio y los tiempos.",
    ],
  ],
  [
    "pista-led-lima",
    "Pista LED para fiestas en Lima",
    "La luz también forma parte del baile.",
    "La pista LED Infinity puede formar parte de una experiencia de mayor producción. Su instalación depende del espacio, los accesos y la distribución del evento.",
    ["club-led", "led"],
    [
      "Antes de elegir dimensiones|Envía un video del lugar y señala puertas, mobiliario y zonas de tránsito. No todos los montajes funcionan en todos los espacios.",
      "Coordinada con DJ y luces|Compara los formatos LED y consulta el alcance del montaje para tu celebración.",
    ],
  ],
  [
    "karaoke-fiestas-lima",
    "Karaoke para fiestas en Lima",
    "Una canción puede reunir a todo el grupo.",
    "El karaoke aporta una forma de participar distinta al baile. Cuéntanos si será el centro de la reunión o una actividad dentro de la fiesta.",
    ["chicoteca", "home"],
    [
      "Elige el momento|Alternar canto y baile puede ayudar a dar variedad al encuentro. La propuesta se adapta al grupo y al horario.",
      "Revisa el espacio|Ubicación de pantalla, sonido y participantes se coordinan según el lugar. Consulta los equipos incluidos en tu cotización.",
    ],
  ],
  [
    "just-dance-fiestas-lima",
    "Just Dance para fiestas en Lima",
    "Sigue el ritmo y comparte el reto.",
    "Just Dance combina música y movimiento. Puede incorporarse a una propuesta de entretenimiento según la edad, los gustos y el espacio disponible.",
    ["home", "neon"],
    [
      "Una actividad para compartir|Puede alternarse con retos y juegos. Cuéntanos cuántos invitados participarán para organizar la dinámica.",
      "Visibilidad y movimiento|Necesitamos evaluar la zona de proyección o pantalla y el espacio para moverse. Envíanos referencias del lugar.",
    ],
  ],
  [
    "fiestas-en-departamentos-lima",
    "Fiestas en departamentos en Lima",
    "¿Tu departamento parece demasiado pequeño?",
    "Antes de descartar una fiesta en casa, revisemos el espacio. El montaje depende de invitados, distribución, mobiliario, accesos y experiencia elegida.",
    ["chicoteca", "home"],
    [
      "Muéstranos el recorrido|Un video desde el acceso hasta la sala ayuda a entender puertas, ascensor, escaleras y zonas de montaje.",
      "No todo cabe siempre|Pista LED, decoración, DJ y animación requieren espacios distintos. Propondremos lo que resulte viable después de revisar tu lugar.",
      "Cuenta a los invitados|La circulación importa. Indica cuántas personas asistirán y qué muebles podrían moverse.",
    ],
  ],
  [
    "mr-fiesta-live",
    "MR Fiesta Live",
    "La fiesta también se conecta.",
    "Los invitados acceden al evento, piden canciones, reaccionan y comparten fotos. La cabina recibe los pedidos y el DJ gestiona qué suena.",
    [],
    [
      "Escanea y entra|Accede al enlace o QR del evento e identifícate con tu nombre o apodo. La experiencia depende de conexión a internet.",
      "Participa desde tu celular|Pide canciones, vota, reacciona y comparte fotos durante el encuentro. El DJ administra los pedidos; enviar una canción no garantiza que se reproduzca.",
      "Conecta con la cabina|Live acompaña la fiesta presencial. Consulta cómo incorporarlo a la producción de tu evento.",
    ],
  ],
  [
    "fiestas-por-edades",
    "Guía de fiestas por edades",
    "Empieza por lo que les gusta hacer.",
    "La edad es una orientación, no una regla rígida. Usa esta guía y el recomendador para combinar música, baile, juegos y producción según tu grupo.",
    [],
    [
      "Sus gustos primero|Preguntar qué quieren hacer evita elegir un formato solo por costumbre. Pueden preferir karaoke, baile o retos.",
      "La edad no lo define todo|Número de invitados, espacio y duración también ayudan a elegir. Consulta una propuesta adaptada a tus respuestas.",
    ],
  ],
];
export const initialLandings: Landing[] = entries.map(
  ([slug, title, description, intro, experienceIds, sections]) => ({
    id: slug,
    slug,
    title,
    description,
    intro,
    experienceIds,
    sections: sections.map((s) => {
      const [title, body] = s.split("|");
      return { title, body };
    }),
    asset: null,
    enabled: true,
    seoTitle: `${title} | MR Fiesta`,
    seoDescription: `${description} ${intro}`.slice(0, 160),
    cta: slug.includes("departamentos")
      ? "ENVÍANOS UN VIDEO DE TU ESPACIO"
      : slug.includes("corporativos")
        ? "COTIZAR EVENTO CORPORATIVO"
        : "QUIERO ESTA EXPERIENCIA",
    kind: slug.includes("corporativos")
      ? "corporate"
      : slug === "mr-fiesta-live"
        ? "live"
        : slug === "fiestas-por-edades"
          ? "ages"
          : slug.includes("departamentos")
            ? "spaces"
            : "service",
  }),
);
