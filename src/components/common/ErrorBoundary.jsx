import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-400px flex flex-col items-center justify-center p-8 bg-rose-50/50 border border-rose-200 rounded-2xl m-6 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-3xl mb-4 font-bold">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            დაფიქსირდა მოულოდნელი შეცდომა
          </h2>
          <p className="text-sm text-slate-600 max-w-md mb-6">
            სისტემამ დააფიქსირა შეცდომა კომპონენტის რენდერისას. გთხოვთ სცადოთ
            გვერდის გადატვირთვა ან დაუკავშირდეთ კლინიკის ცხელ ხაზს.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition shadow-sm"
            >
              სცადეთ ხელახლა (Retry)
            </button>
            <a
              href="tel:+995322000000"
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
            >
              ცხელი ხაზი: 032 2 00 00 00
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
