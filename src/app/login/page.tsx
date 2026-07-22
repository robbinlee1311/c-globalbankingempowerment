import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <header className="flex justify-between items-center mb-20">
          <div>
            <h1 className="text-4xl font-bold">
              C-Global Banking
            </h1>
            <p className="text-blue-200">
              Empowerment Portal
            </p>
          </div>

          <Link
            href="/login"
            className="bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-blue-100"
          >
            Login
          </Link>
        </header>

        <section className="grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-6xl font-bold leading-tight mb-6">
              Secure Digital Banking
            </h2>

            <p className="text-xl text-blue-100 mb-10">
              Manage your accounts, transfer funds, pay bills,
              monitor transactions, and securely access your
              banking dashboard from anywhere in the world.
            </p>

            <div className="flex gap-4">
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl font-semibold"
              >
                Online Banking
              </Link>

              <Link
                href="/login"
                className="border border-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-900"
              >
                Open Account
              </Link>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10">

            <h3 className="text-3xl font-bold mb-8">
              Banking Services
            </h3>

            <div className="space-y-5">

              <div className="p-5 rounded-xl bg-white/10">
                💳 Personal & Business Accounts
              </div>

              <div className="p-5 rounded-xl bg-white/10">
                💸 Instant Money Transfers
              </div>

              <div className="p-5 rounded-xl bg-white/10">
                📈 Investment & Savings
              </div>

              <div className="p-5 rounded-xl bg-white/10">
                🏦 Loans & Credit Facilities
              </div>

              <div className="p-5 rounded-xl bg-white/10">
                🔐 Secure Online Banking
              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}