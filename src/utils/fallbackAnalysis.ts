import { RoomAnalysisData, RoomType, DeclutterGoal } from '../types';

/**
 * High quality, zero-failure local fallback analysis engine
 * Generates an empathetic, comprehensive 4-Box declutter plan in Turkish
 * whenever network is offline or remote server cannot be reached.
 */
export function generateFallbackAnalysis(params: {
  roomType: RoomType;
  goal: DeclutterGoal;
  focusNotes?: string;
}): RoomAnalysisData {
  const { roomType, goal, focusNotes = '' } = params;

  // Determine score and level
  let clutterScore = 7;
  let clutterLevel: 'Low' | 'Moderate' | 'High' | 'Overwhelming' = 'Moderate';

  if (goal.includes('Acil') || goal.includes('15')) {
    clutterScore = 6;
    clutterLevel = 'Moderate';
  } else if (goal.includes('Derinlemesine') || goal.includes('Deep')) {
    clutterScore = 8;
    clutterLevel = 'High';
  }

  const cleanRoomType = String(roomType);

  return {
    roomType: cleanRoomType,
    clutterScore,
    clutterLevel,
    summary: `${cleanRoomType} alanınız yüksek bir ferahlık potansiyeline sahip. Yatay yüzeyleri boşaltıp 4-Kutu yöntemiyle gruplandırma yaptığınızda oda 20 dakika içinde çok daha aydınlık ve huzurlu bir atmosfere kavuşacaktır.`,
    keyIssues: [
      'Yatay yüzeylerde (masa/tezgah/sehpa) günlük eşyaların ve evrakların birikmesi',
      'Kablo karmaşası ve şarj aletlerinin dağınık durarak gözü yorması',
      'Sık kullanılan eşyalar ile nadiren kullanılanların aynı bölgede karışması',
      focusNotes ? `Özel odak konusu: ${focusNotes}` : 'Dikey duvar ve kapı arkası saklama potansiyelinin yeterince değerlendirilmemesi',
    ],
    quickWins: [
      {
        task: 'Çöp ve Geri Dönüşümleri Topla',
        duration: '2 dk',
        impact: 'Göz hizasındaki gereksiz kalabalığı anında yok eder ve motivasyon sağlar.',
      },
      {
        task: 'Ait Olmayan 5 Eşyayı Odadan Çıkar',
        duration: '3 dk',
        impact: 'Odaya başka yerlerden gelmiş kupa, giysi ve evrakları ait oldukları yere götürerek ferahlık sağlar.',
      },
      {
        task: 'Ana Yatay Yüzeyi Boşalt ve Sil',
        duration: '4 dk',
        impact: 'Gözün ilk çarptığı ana yüzeyin pırıl pırıl olması zihinsel rahatlama verir.',
      },
    ],
    zones: [
      {
        zoneName: 'Ana Çalışma / Etkinlik Yüzeyi',
        currentObservation: 'Yüzeyde dağınık küçük eşyalar, not kağıtları ve bardaklar bulunuyor.',
        recommendation: 'Sadece her gün kullanılan 2-3 temel eşyayı yüzeyde tutun, geri kalanları çekmece veya sepetlere alın.',
        suggestedProducts: ['Masaüstü düzenleyici tepsi', 'Bölmeli çekmece içi kutusu'],
      },
      {
        zoneName: 'Kablo ve Elektronik Alanı',
        currentObservation: 'Sarkan kablolar ve priz çevresi karmaşık bir görüntü oluşturuyor.',
        recommendation: 'Kabloları cırt cırtlı bağlarla demetleyin ve priz kutusu içinde gizleyin.',
        suggestedProducts: ['Kablo toplama kanalı', 'Kapaklı priz gizleme kutusu'],
      },
      {
        zoneName: 'Zemin ve Geçiş Yolu',
        currentObservation: 'Zeminde poşetler, kutular veya ayakkabılar geçişi daraltıyor.',
        recommendation: 'Zemini tamamen serbest bırakın; eşyaları dikey askı ve raflara taşıyın.',
        suggestedProducts: ['Kapı arkası asılabilir ceplik', 'Dikey duvar rafı'],
      },
    ],
    actionPlan: [
      {
        id: 'fallback-step-1',
        title: '4 Kutu / Poşet İstasyonunu Kur',
        category: 'declutter',
        timeEstimate: '3 dk',
        boxMethodCategory: 'Sakla',
        description: 'Odanın ortasına yan yana 4 kutu veya büyük poşet koyun: 1. Sakla, 2. Bağışla/Sat, 3. Yerini Değiştir, 4. At/Geri Dönüşüm.',
        proTip: 'Kutuları hazırlamak zihninizi kararsızlıktan kurtarır ve her eşyaya hızlıca bir yuva atamanızı sağlar.',
      },
      {
        id: 'fallback-step-2',
        title: 'Gözle Görünür Çöpleri ve Atıkları Ayıkla',
        category: 'trash',
        timeEstimate: '5 dk',
        boxMethodCategory: 'At / Geri Dönüştür',
        description: 'Eski fişler, kurumuş tükenmez kalemler, boş ambalajlar ve kırık nesneleri doğrudan 4. kutuya atın.',
        proTip: 'Bu adımda hiçbir duygusal bağ gerektirmeyen nesnelerle başladığınız için ivme kazanırsınız.',
      },
      {
        id: 'fallback-step-3',
        title: 'Bu Odaya Ait Olmayanları Topla (Yerini Değiştir)',
        category: 'donate',
        timeEstimate: '5 dk',
        boxMethodCategory: 'Yerini Değiştir',
        description: 'Başka odalardan gelmiş tabak, bardak, kıyafet veya aletleri 3. kutuya koyup ait oldukları odalara iade edin.',
        proTip: 'Hemen dağıtmak yerine önce kutuda toplayıp tek seferde taşımak enerjinizi korur.',
      },
      {
        id: 'fallback-step-4',
        title: 'Kalan Eşyaları Benzerliklerine Göre Grupla',
        category: 'organize',
        timeEstimate: '8 dk',
        boxMethodCategory: 'Sakla',
        description: 'Saklanacak eşyaları "sık kullanılanlar" ve "arada sırada kullanılanlar" olarak ikiye ayırın.',
        proTip: 'Günde birden fazla kullandığınız eşyalar tek elle ulaşabileceğiniz mesafede olmalı.',
      },
      {
        id: 'fallback-step-5',
        title: 'Son Dokunuş ve Yüzey Temizliği',
        category: 'store',
        timeEstimate: '4 dk',
        boxMethodCategory: 'Sakla',
        description: 'Boşalan yüzeyleri nemli bir bezle silin, bir bitki veya ferahlatıcı küçük bir obje yerleştirin.',
        proTip: 'Temiz bir koku ve açık bir yüzey başarınızı somutlaştırır.',
      },
    ],
    storageSolutions: [
      {
        title: 'Şeffaf veya Etiketli Saklama Sepetleri',
        purpose: 'Kategorize edilen eşyaların dağılmasını önler ve tek bakışta bulunmasını sağlar.',
        placement: 'Açık raf sistemleri veya dolap içleri.',
      },
      {
        title: 'Kendinden Yapışkanlı Kablo Klipsleri',
        purpose: 'Masa arkasındaki sarkan kabloları gizleyerek görsel kirliliği yok eder.',
        placement: 'Çalışma masasının arka tablası veya süpürgelik kenarları.',
      },
      {
        title: 'Katmanlı Çekmece Düzenleyiciler',
        purpose: 'Küçük kırtasiye ve aksesuar eşyalarının birbirine girmesini engeller.',
        placement: 'Komodin ve çalışma masası üst çekmecesi.',
      },
    ],
    maintenanceHabits: [
      {
        habit: 'Akşam 3 Dakikalık "Sıfırlama" Rutini',
        frequency: 'Her Gece (3 dk)',
        description: 'Yatmadan önce yüzeydeki bardak ve evrakları kaldırarak güne temiz bir alanla başlama kuralı.',
      },
      {
        habit: '"Biri Gelirse Biri Gider" Kuralı',
        frequency: 'Her Alışverişte',
        description: 'Odaya yeni bir giysi, kitap veya biblo aldığınızda eskilerden birini bağış kutusuna aktarın.',
      },
    ],
  };
}

/**
 * Intelligent local chat responder for coach advice when offline
 */
export function generateFallbackChatReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('kutu') || lower.includes('box')) {
    return `**4 Kutu Yöntemi Nasıl Uygulanır?**\n\n1. **Sakla (Yeşil):** Gerçekten sevdiğin, son 6 ayda kullandığın ve bu odaya ait olanlar.\n2. **Bağışla/Sat (Mavi):** Çalışır durumda ama artık sana hizmet etmeyenler.\n3. **Yerini Değiştir (Sarı):** Evin başka bir yerine (mutfak, banyo, antre) ait olanlar.\n4. **At/Geri Dönüşüm (Kırmızı):** Kırık, yırtık, bozuk veya kullanılamaz olanlar.\n\nBir kutu veya çöp poşeti hazırla, ilk 5 eşyayı ayıklamaya hemen başlayalım!`;
  }

  if (lower.includes('nereden') || lower.includes('başla') || lower.includes('acil')) {
    return `Harika bir karar! En önemli kural: **Tüm odayı aynı anda düzeltmeye çalışma.**\n\nİşte hemen başlayabileceğin **10 dakikalık mikro plan**:\n1. Odadaki tek bir düz yüzeyi seç (çalışma masası veya yatak üstü).\n2. Gözüne çarpan çöpleri ve boş ambalajları poşete at (2 dk).\n3. Odaya ait olmayan bardak/tabakları mutfağa götür (3 dk).\n4. Yüzeyi boşaltıp nemli bir bezle sil (3 dk).\n\nSadece bu küçük adım bile sana büyük bir ferahlık verecek. Hangi yüzeyden başlamak istersin?`;
  }

  if (lower.includes('kıyafet') || lower.includes('giysi') || lower.includes('dolap')) {
    return `Kıyafet ve gardırop düzeninde en etkili taktik **"Ters Askı"** yöntemidir:\n\n* Tüm askıların yönünü dışa doğru çevir.\n* Giydiğin kıyafetleri geri asarken askıyı normal yönde as.\n* 3 ay sonra hala ters duran askılardaki kıyafetler giymediğin giysilerdir; onları güvenle bağışlayabilirsin!`;
  }

  return `Çok güzel bir soru! Düzenleme sürecinde en kritik ilke, duygusal olarak yorulmadan **küçük adımlarla ilerlemektir**.\n\nDağınıklığı gözünde büyütmek yerine 15 dakikalık bir zamanlayıcı kur ve tek bir çekmeceye veya masanın sağ köşesine odaklan. Süre bitince dur ve başardığın küçük alanı kutla!\n\nŞu anda odanda seni en çok rahatsız eden tek bir nesne veya köşe var mı? Bana ondan bahset, birlikte çözelim!`;
}
