"use client";

import { Download, Trash2, Smartphone } from "lucide-react";

export default function Settings() {
  return (
    <div className="bg-gray-50 min-h-screen  md:pb-8">
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          Settings
        </h1>
      </header>
      {/* Assuming your Header accepts a title prop */}
      <main className="px-4 pt-6 space-y-6 max-w-5xl mx-auto">
        {/* App Info Card */}
        <section className="bg-white rounded-3xl p-8 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#477A71] rounded-2xl flex items-center justify-center">
            {/* Replace with your actual app icon if you have it */}
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Flowly</h1>
          <p className="text-sm text-gray-600 mb-6">Personal Finance Tracker</p>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="text-center">
              <p className="font-bold text-2xl text-gray-900">0</p>
              <p>Transactions</p>
            </div>
            <div className="w-px h-10 bg-gray-300" />
            <div className="text-center">
              <p className="font-bold text-2xl text-gray-900">18</p>
              <p>Categories</p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="space-y-4">
          {/* Install App */}
          <button className="w-full bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Smartphone size={24} className="text-gray-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Install App</p>
                <p className="text-sm text-gray-600">
                  Add Flowly to your home screen
                </p>
              </div>
            </div>
            <div className="bg-[#477A71] text-white px-6 py-3 rounded-full font-semibold text-sm">
              Install
            </div>
          </button>

          {/* Export Data */}
          <button className="w-full bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Download size={24} className="text-gray-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Export Data</p>
                <p className="text-sm text-gray-600">
                  Download your data as JSON
                </p>
              </div>
            </div>
            <div className="border-2 border-[#477A71] text-[#477A71] px-6 py-3 rounded-full font-semibold text-sm">
              Export
            </div>
          </button>

          {/* Clear All Data - Destructive */}
          <button className="w-full bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold  text-red-600">Clear All Data</p>
                <p className="text-sm text-gray-600">
                  Delete all transactions and reset categories
                </p>
              </div>
            </div>
            <div className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold text-sm">
              Clear
            </div>
          </button>
        </section>

        {/* Footer Info */}
        <section className="text-center py-8">
          <p className="text-sm text-gray-600">
            Flowly Made with <span className="text-green-500">❤️</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            All data is stored locally on your device
          </p>
        </section>
      </main>
    </div>
  );
}
