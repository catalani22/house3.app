import React, { useState, useEffect } from 'react';
import { useFirebase } from './FirebaseProvider';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Property, OwnerProfile, ClaimRequest } from '../types';
import UserBookings from './UserBookings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Wallet, Home, CheckCircle, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function OwnerDashboard() {
  const { user, profile } = useFirebase();
  const { t } = useTranslation();
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile | null>(null);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [walletAddress, setWalletAddress] = useState('');
  const [preferredToken, setPreferredToken] = useState('USDC');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [claimPropertyId, setClaimPropertyId] = useState('');
  const [proofUrl, setProofUrl] = useState('');

  useEffect(() => {
    if (!user) return;

    const profilePath = `ownerProfiles/${user.uid}`;
    const unsubscribeProfile = onSnapshot(doc(db, 'ownerProfiles', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as OwnerProfile;
        setOwnerProfile(data);
        setWalletAddress(data.walletAddress);
        setPreferredToken(data.preferredToken);
        setTermsAccepted(data.termsAccepted);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, profilePath);
    });

    const propsPath = 'properties';
    const qProps = query(collection(db, propsPath), where('ownerId', '==', user.uid));
    const unsubscribeProps = onSnapshot(qProps, (snapshot) => {
      setMyProperties(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Property)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, propsPath);
    });

    const claimsPath = 'claimRequests';
    const qClaims = query(collection(db, claimsPath), where('userId', '==', user.uid));
    const unsubscribeClaims = onSnapshot(qClaims, (snapshot) => {
      setClaimRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ClaimRequest)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, claimsPath);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeProps();
      unsubscribeClaims();
    };
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await setDoc(doc(db, 'ownerProfiles', user.uid), {
        userId: user.uid,
        walletAddress,
        preferredToken,
        termsAccepted,
        termsAcceptedAt: termsAccepted ? new Date().toISOString() : null
      });
      alert('Profile updated successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `ownerProfiles/${user.uid}`);
    }
  };

  const handleClaimProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !claimPropertyId) return;

    try {
      await addDoc(collection(db, 'claimRequests'), {
        propertyId: claimPropertyId,
        userId: user.uid,
        status: 'pending',
        proofUrl,
        createdAt: new Date().toISOString()
      });
      setClaimPropertyId('');
      setProofUrl('');
      alert('Claim request submitted!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'claimRequests');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-serif mb-2">Acesso Restrito</h2>
        <p className="text-muted-foreground mb-6">Por favor, faça login para acessar o Dashboard do Proprietário.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-serif mb-2">{t('owner_dashboard.title').split(' ').slice(0, -1).join(' ')} <span className="gold-text">{t('owner_dashboard.title').split(' ').slice(-1)}</span></h1>
        <p className="text-muted-foreground">{t('owner_dashboard.subtitle')}</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 border border-border">
          <TabsTrigger value="profile" className="gap-2">
            <Wallet className="w-4 h-4" /> {t('owner_dashboard.tabs.profile')}
          </TabsTrigger>
          <TabsTrigger value="bookings" className="gap-2">
            <Clock className="w-4 h-4" /> {t('owner_dashboard.tabs.bookings')}
          </TabsTrigger>
          <TabsTrigger value="properties" className="gap-2">
            <Home className="w-4 h-4" /> {t('owner_dashboard.tabs.properties')}
          </TabsTrigger>
          <TabsTrigger value="claims" className="gap-2">
            <ShieldCheck className="w-4 h-4" /> {t('owner_dashboard.tabs.claims')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <UserBookings />
        </TabsContent>

        <TabsContent value="profile">
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{t('owner_dashboard.profile.title')}</CardTitle>
              <CardDescription>
                {t('owner_dashboard.profile.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('owner_dashboard.profile.wallet_label')}</label>
                  <Input 
                    placeholder="0x... ou Endereço Solana" 
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-background/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('owner_dashboard.profile.token_label')}</label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm"
                    value={preferredToken}
                    onChange={(e) => setPreferredToken(e.target.value)}
                  >
                    <option value="USDC">USDC (Stablecoin)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="BTC">Bitcoin (WBTC/BTC)</option>
                    <option value="SOL">Solana (SOL)</option>
                  </select>
                </div>
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed">
                    {t('owner_dashboard.profile.terms_label')}
                  </label>
                </div>
                <Button type="submit" className="w-full gold-gradient text-black font-bold">
                  {t('owner_dashboard.profile.save_button')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProperties.length === 0 ? (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
                <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">Você ainda não possui imóveis vinculados.</p>
                <p className="text-xs text-muted-foreground mt-2">Use a aba "Reivindicações" para solicitar a posse de um imóvel pré-listado.</p>
              </div>
            ) : (
              myProperties.map(prop => (
                <Card key={prop.id} className="overflow-hidden bg-card/50 border-border">
                  <div className="aspect-video relative">
                    <img src={prop.image} alt={prop.title} className="object-cover w-full h-full" />
                    <Badge className="absolute top-2 right-2 bg-green-500/80">Ativo</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-serif text-lg mb-1">{prop.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{prop.location}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">R$ {prop.price.toLocaleString()}/noite</span>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="claims">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Reivindicar Imóvel</CardTitle>
                <CardDescription>
                  Encontrou seu imóvel pré-listado via scraping? Solicite a posse para gerenciar reservas diretamente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleClaimProperty} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ID do Imóvel ou Link Original</label>
                    <Input 
                      placeholder="Ex: Villa Azure ou link do JamesEdition" 
                      value={claimPropertyId}
                      onChange={(e) => setClaimPropertyId(e.target.value)}
                      className="bg-background/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Link de Comprovação (Opcional)</label>
                    <Input 
                      placeholder="Link para seu perfil em outra plataforma ou site oficial" 
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <Button type="submit" variant="secondary" className="w-full">
                    Enviar Solicitação de Claim
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Status das Solicitações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {claimRequests.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhuma solicitação pendente.</p>
                  ) : (
                    claimRequests.map(claim => (
                      <div key={claim.id} className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border">
                        <div className="flex items-center gap-3">
                          {claim.status === 'pending' ? <Clock className="w-4 h-4 text-yellow-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                          <div>
                            <p className="text-sm font-medium">{claim.propertyId}</p>
                            <p className="text-xs text-muted-foreground">{new Date(claim.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge variant={claim.status === 'pending' ? 'outline' : 'default'}>
                          {claim.status === 'pending' ? 'Pendente' : 'Aprovado'}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
