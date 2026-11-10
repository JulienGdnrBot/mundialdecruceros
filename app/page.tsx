import Image from "next/image";

// Página provisional. La portada real se diseña cuando el cliente devuelva el
// cuestionario (segmento, navieras, exigencias de marca). No se reutiliza
// contenido del sitio WordPress actual: decisión del 10 nov 2026.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
        <Image
          src="/marca/logo-46-lema.png"
          alt="Mundial de Cruceros — Haciendo navegar tus sueños desde 1980"
          width={1200}
          height={762}
          priority
          className="h-auto w-72 sm:w-96"
        />
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold text-azul sm:text-3xl">
            Estamos preparando nuestro nuevo sitio
          </h1>
          <p className="mt-3 text-gris">Muy pronto.</p>
        </div>
      </section>
      <div className="h-2 bg-amarillo" aria-hidden />
      <footer className="bg-azul px-6 py-8 text-center">
        <Image
          src="/marca/logo-46-negativo.png"
          alt="Mundial de Cruceros"
          width={1200}
          height={756}
          className="mx-auto h-auto w-40"
        />
      </footer>
    </main>
  );
}
