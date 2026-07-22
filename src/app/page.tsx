import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="flex items-center justify-between mb-20">
          <div>
            <h1 className="text-4xl font-bold">C-Global Banking</h1>
            <p className="text-blue-200">Empowerment Portal</p>
          </div>

          <Link
            href="/login"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-900 hover:bg-blue-100"
          >
            Login
          </Link>
        </header>

        <section className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="mb-6 text-6xl font-bold leading-tight">
              Secure Digital Banking
            </h2>

            <p className="mb-10 text-xl text-blue-100">
              Access your accounts, transfer funds, pay bills, manage cards,
              and securely bank online anytime.
            </p>

            <div className="flex gap-4">
              <Link
                href="/login"
                className="rounded-xl bg-blue-500 px-8 py-4 font-semibold hover:bg-blue-600"
              >
                Online Banking
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-white px-8 py-4 font-semibold hover:bg-white hover:text-blue-900"
              >
                Open Account
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-10 backdrop-blur">
            <h3 className="mb-8 text-3xl font-bold">
              Banking Services
            </h3>

            <div className="space-y-4">
              <div className="rounded-xl bg-white/10 p-5">
                💳 Personal & Business Accounts
              </div>

              <div className="rounded-xl bg-white/10 p-5">
                💸 Instant Transfers
              </div>

              <div className="rounded-xl bg-white/10 p-5">
                📈 Savings & Investments
              </div>

              <div className="rounded-xl bg-white/10 p-5">
                🏦 Loans & Credit
              </div>

              <div className="rounded-xl bg-white/10 p-5">
                🔐 Secure Online Banking
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}