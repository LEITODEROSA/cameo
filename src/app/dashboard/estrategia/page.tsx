export default function EstrategiaPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Estrategia de contenido de Cameo</h1>
        <p className="mt-1 max-w-3xl text-sm text-neutral-400">
          Resumen de ESTRATEGIA_MKT.pdf. El dashboard de competencia existe para alimentar esta estrategia
          con evidencia real — no la reemplaza.
        </p>
      </div>

      <Section title="Los 4 pilares">
        <p>
          Hoy Cameo funciona con 3 pilares: <strong>Pauta, Calidad, Precio</strong>. El objetivo es sumar
          un <strong>4º pilar: la marca misma</strong> — que el contenido/storytelling sea, en sí mismo,
          una razón para elegir Cameo, no solo el producto.
        </p>
      </Section>

      <Section title="Por qué ahora">
        <p>
          &quot;La competencia es abismal, no solo compite con marcas locales, se volvió internacional. Las
          redes están saturadas, la retención se volvió casi nula: el objetivo es dejar una huella en el
          público. La pauta permanece en la mente del consumidor, el contenido en redes activa el
          recuerdo.&quot;
        </p>
      </Section>

      <Section title="Regla de campañas">
        <p>
          No depender de un &quot;drop&quot;/lanzamiento de producto como excusa para comunicar. Desarrollar
          campañas con una idea/concepto independiente del producto, pero con estructura o formato
          coherente.
        </p>
        <p className="mt-2 font-medium text-neutral-200">
          Desarrollo de campaña → Elección de productos → Lanzamiento
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-400">
          <li>Elección de productos: no mostrar todo el catálogo — curar, mostrar lo necesario, generar tráfico a la web.</li>
          <li>Lanzamiento: dejar de &quot;postear por postear&quot; — afilar el timing.</li>
          <li>Ejemplo bueno citado: Eme Studios / campaña &quot;WHITE ECHO&quot; — concepto + fecha + colección + reel, todo coherente.</li>
          <li>Ejemplo de alerta citado: Scuffers FW26 — buena estética/historias, pero concepto de campaña poco claro.</li>
        </ul>
      </Section>

      <Section title="Objetivo por canal">
        <div className="grid gap-4 sm:grid-cols-2">
          <Channel name="Historias (Instagram)">
            Venta indirecta: mostrar el producto en distintos formatos para fidelizar, sin mandar tráfico
            directo a la web. Anuncios de restock/nuevos ingresos y de acciones comerciales.
          </Channel>
          <Channel name="Posteos (feed)">
            Lanzamientos de campaña con comunicación coherente, posteos de comunidad con
            influencers/microinfluencers, fotoproducto adaptado a la campaña, acciones comerciales.
          </Channel>
          <Channel name="Reels">
            Refuerzo de campañas (deben acompañar el concepto, no ir sueltos), BTS de campañas, video de
            producto en modelo (prenda en uso), video de producto para mostrar detalle.
          </Channel>
          <Channel name="TikTok">Contenido BTS.</Channel>
        </div>
      </Section>

      <Section title="Banco de creadores">
        <p>
          La selección de microinfluencers/creadores debe ser cautelosa: los perfiles siempre alineados a
          la estética e identidad de la marca, no elegidos solo por alcance.
        </p>
      </Section>

      <Section title="Calendarización">
        <p>
          Definir una cantidad de campañas por semestre (campaña → elección de productos → ejecución) en
          vez de planificar posteo por posteo.
        </p>
      </Section>

      <Section title="Tono, identidad y estética">
        <ul className="list-disc space-y-1 pl-5 text-neutral-400">
          <li>Tono: una persona amigable que te hace sentir parte aunque no la conozcas.</li>
          <li>Identidad: básico pero creativo.</li>
          <li>Estética: minimalista, pero minimalista no es sinónimo de monótono — &quot;Cameo no dice mucho pero muestra mucho&quot;.</li>
          <li>Hoy transmite juventud, creatividad y diversión — el objetivo es mantenerlo con una propuesta más curada y estratégica.</li>
        </ul>
      </Section>

      <Section title="Buyer persona">
        <p className="italic text-neutral-400">
          Mujer joven egresada de colegio privado no bilingüe, círculo social de clase media/media baja.
          Estudió marketing en la UADE, le interesan la moda y las redes. <strong>Conoce todas las marcas
          pero no las consume por sus precios elevados</strong> — trabaja en una agencia de publicidad con
          sueldo arriba de la media, pero ahorra o viaja con sus ingresos en vez de gastarlos en ropa cara.
        </p>
        <p className="mt-2 text-neutral-300">
          El hueco: ella ya sigue y desea la estética de Aritzia/Nude Project/SKIMS/Eme Studios, pero no las
          compra por precio. Cameo puede ocupar ese lugar.
        </p>
      </Section>

      <Section title="Cómo cruzar esto con el dashboard de competencia">
        <p>
          Al cargar contenido de un competidor en &quot;Contenido&quot;, además de la estética, pensá a qué
          objetivo de canal responde (¿lanzamiento de campaña? ¿BTS? ¿restock?) — así la sección de
          Tendencias no solo muestra qué estética funciona, sino qué está funcionando para el mismo
          objetivo que persigue cada canal de Cameo.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-neutral-300">{children}</div>
    </section>
  );
}

function Channel({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 p-4">
      <div className="text-xs font-medium uppercase text-neutral-500">{name}</div>
      <p className="mt-1 text-sm text-neutral-400">{children}</p>
    </div>
  );
}
