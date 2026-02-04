import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../services/i18n_service.dart';

// ============================================
// HOME SCREEN - Početna stranica
// ============================================
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final i18n = context.watch<I18nService>();

    // Status bar bijeli tekst/ikone za tamnu hero sliku
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);
    final statusBarHeight = MediaQuery.of(context).padding.top;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Crna pozadina za gornji dio (overscroll gore)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            bottom: MediaQuery.of(context).size.height * 0.5,
            child: Container(color: Colors.black),
          ),
          SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ========== HERO SEKCIJA ==========
                _buildHeroSection(context, i18n),

                // Bijela pozadina za sadržaj ispod hero slike
                Container(
                  color: Colors.white,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const SizedBox(height: 40),

                      // ========== FILOZOFIJA SEKCIJA ==========
                      _buildPhilosophySection(i18n),

                      const SizedBox(height: 40),

                      // ========== INFO KARTICE ==========
                      _buildInfoCards(i18n),

                      // SafeArea samo za dno (bottom nav)
                      SizedBox(height: 40 + MediaQuery.of(context).padding.bottom),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Language selector - pomaknut ispod status bara
          Positioned(
            top: statusBarHeight + 8,
            right: 16,
            child: _LanguageSelector(i18n: i18n),
          ),
        ],
      ),
    );
  }

  // Hero sekcija sa slikom i tekstom
  Widget _buildHeroSection(BuildContext context, I18nService i18n) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    final statusBarHeight = MediaQuery.of(context).padding.top;
    final heroHeight = (screenHeight * 0.45).clamp(280.0, 500.0) + statusBarHeight;
    final titleSize = (screenWidth * 0.12).clamp(32.0, 48.0);
    final subtitleSize = (screenWidth * 0.065).clamp(18.0, 28.0);
    final letterSpacing = (screenWidth * 0.04).clamp(8.0, 16.0);

    return Container(
      height: heroHeight,
      decoration: const BoxDecoration(
        // Slika pozadine
        image: DecorationImage(
          image: NetworkImage(
            'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070',
          ),
          fit: BoxFit.cover,
        ),
      ),
      child: Container(
        // Gradient overlay
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.black.withValues(alpha: 0.3),
              Colors.black.withValues(alpha: 0.7),
            ],
          ),
        ),
        child: Padding(
          padding: EdgeInsets.all(screenWidth < 360 ? 16.0 : 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Naslov
              Text(
                'AURA',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: titleSize,
                  fontWeight: FontWeight.w200,
                  letterSpacing: letterSpacing,
                ),
              ),
              const SizedBox(height: 8),
              // Podnaslov
              Text(
                i18n.t('home.heroTitle'),
                style: TextStyle(
                  color: Colors.white,
                  fontSize: subtitleSize,
                  fontStyle: FontStyle.italic,
                  fontWeight: FontWeight.w300,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                i18n.t('home.season'),
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                  letterSpacing: 4,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Sekcija s filozofijom restorana
  Widget _buildPhilosophySection(I18nService i18n) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Label
          Text(
            i18n.t('home.philosophy'),
            style: TextStyle(
              fontSize: 10,
              letterSpacing: 4,
              color: Colors.grey[500],
            ),
          ),
          const SizedBox(height: 16),
          // Naslov
          Text(
            i18n.t('home.philosophyTitle'),
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w300,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 16),
          // Opis
          Text(
            i18n.t('home.philosophyText'),
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }

  // Info kartice (radno vrijeme, lokacija)
  Widget _buildInfoCards(I18nService i18n) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth < 300) {
            return Column(
              children: [
                _InfoCard(
                  icon: Icons.access_time,
                  title: i18n.t('home.hours'),
                  subtitle: i18n.t('home.hoursValue'),
                ),
                const SizedBox(height: 12),
                _InfoCard(
                  icon: Icons.location_on_outlined,
                  title: i18n.t('home.location'),
                  subtitle: i18n.t('home.locationValue'),
                ),
              ],
            );
          }
          return Row(
            children: [
              Expanded(
                child: _InfoCard(
                  icon: Icons.access_time,
                  title: i18n.t('home.hours'),
                  subtitle: i18n.t('home.hoursValue'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _InfoCard(
                  icon: Icons.location_on_outlined,
                  title: i18n.t('home.location'),
                  subtitle: i18n.t('home.locationValue'),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

// ============================================
// LANGUAGE SELECTOR WIDGET
// ============================================
class _LanguageSelector extends StatelessWidget {
  final I18nService i18n;

  const _LanguageSelector({required this.i18n});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: I18nService.supportedLanguages.map((lang) {
          final isActive = i18n.currentLanguage == lang['code'];
          return GestureDetector(
            onTap: () => i18n.setLanguage(lang['code'] as Language),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 32,
              height: 32,
              margin: const EdgeInsets.symmetric(horizontal: 2),
              decoration: BoxDecoration(
                color: isActive ? const Color(0xFF1C1917) : Colors.transparent,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(
                  lang['flag'] as String,
                  style: const TextStyle(fontSize: 18),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

// ============================================
// INFO CARD WIDGET
// ============================================
// Zasebna komponenta za info kartice
class _InfoCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;

  const _InfoCard({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 24, color: Colors.grey[700]),
          const SizedBox(height: 12),
          Text(
            title,
            style: TextStyle(
              fontSize: 10,
              letterSpacing: 2,
              color: Colors.grey[500],
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
