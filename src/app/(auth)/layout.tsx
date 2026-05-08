// O AuthProvider já está no RootLayout (src/app/layout.tsx)
// Não duplicar aqui para evitar contextos isolados
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
