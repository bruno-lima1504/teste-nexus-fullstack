export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full bg-[#faf8f5]">
      <main className="flex min-h-full flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
