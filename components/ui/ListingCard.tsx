'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Heart, 
  Share2, 
  FileText,
  Eye,
  Plus
} from 'lucide-react'
import { Listing } from '@/types'
import { cn } from '@/lib/cn'

interface ScoreChipProps {
  label: string
  score: number
  icon: React.ReactNode
  variant: 'affordability' | 'accessibility' | 'safety' | 'commute' | 'inclusivity'
}

const ScoreChip: React.FC<ScoreChipProps> = ({ label, score, icon, variant }) => {
  const variants = {
    affordability: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    accessibility: 'bg-blue-100 text-blue-800 border-blue-200',
    safety: 'bg-amber-100 text-amber-800 border-amber-200',
    commute: 'bg-purple-100 text-purple-800 border-purple-200',
    inclusivity: 'bg-teal-100 text-teal-800 border-teal-200',
  }

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border',
      variants[variant]
    )}>
      <span className="flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span className="font-semibold">{score}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  )
}

interface ScoreDonutProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

const ScoreDonut: React.FC<ScoreDonutProps> = ({ score, size = 'md' }) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5
  const radius = size === 'sm' ? 18 : size === 'md' ? 24 : 30
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981' // emerald-500
    if (score >= 60) return '#f59e0b' // amber-500
    return '#ef4444' // red-500
  }

  return (
    <div className={cn('relative', sizes[size])}>
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
        aria-label={`D&I score ${score} out of 100`}
      >
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            strokeDasharray,
            strokeDashoffset
          }}
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          'font-bold text-[var(--fg)]',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        )}>
          {score}
        </span>
      </div>
    </div>
  )
}

interface ListingCardProps {
  listing: Listing
  onSave?: (listing: Listing) => void
  onCompare?: (listing: Listing) => void
  onDetails?: (listing: Listing) => void
  onLeaseQA?: (listing: Listing) => void
  isSaved?: boolean
  isComparing?: boolean
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSave,
  onCompare,
  onDetails,
  onLeaseQA,
  isSaved = false,
  isComparing = false
}) => {
  const {
    id,
    title,
    addr: address,
    rent: price,
    bedrooms,
    bathrooms,
    di_score: dAndIScore,
    subscores
  } = listing

  const affordabilityScore = subscores?.affordability || 0
  const accessibilityScore = subscores?.accessibility || 0
  const safetyScore = subscores?.safety || 0
  const commuteScore = subscores?.commute || 0
  const inclusivityScore = subscores?.inclusivity || 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-[var(--fg)] line-clamp-2 mb-2">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2 text-[var(--fg-muted)] text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{address}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <ScoreDonut score={dAndIScore} size="md" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price and basic info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[var(--success)]" aria-hidden="true" />
            <span className="text-2xl font-bold text-[var(--fg)]">
              {formatPrice(price)}
            </span>
            <span className="text-[var(--fg-muted)] text-sm">/month</span>
          </div>
          <div className="flex items-center gap-4 text-[var(--fg-muted)] text-sm">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" aria-hidden="true" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" aria-hidden="true" />
              <span>{bathrooms}</span>
            </div>
          </div>
        </div>

        {/* Score chips */}
        <div className="flex flex-wrap gap-2">
          <ScoreChip
            label="Affordability"
            score={affordabilityScore}
            icon={<DollarSign className="w-3 h-3" />}
            variant="affordability"
          />
          <ScoreChip
            label="Accessibility"
            score={accessibilityScore}
            icon={<Eye className="w-3 h-3" />}
            variant="accessibility"
          />
          <ScoreChip
            label="Safety"
            score={safetyScore}
            icon={<Heart className="w-3 h-3" />}
            variant="safety"
          />
          <ScoreChip
            label="Commute"
            score={commuteScore}
            icon={<MapPin className="w-3 h-3" />}
            variant="commute"
          />
          <ScoreChip
            label="Inclusivity"
            score={inclusivityScore}
            icon={<Plus className="w-3 h-3" />}
            variant="inclusivity"
          />
        </div>

      </CardContent>

      <CardFooter className="pt-4">
        <div className="flex flex-wrap gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDetails?.(listing)}
            className="flex-1 min-w-0"
          >
            <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
            Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSave?.(listing)}
            className={cn(
              'flex-1 min-w-0',
              isSaved && 'bg-[var(--primary)] text-white border-[var(--primary)]'
            )}
          >
            <Heart className={cn('w-4 h-4 mr-2', isSaved && 'fill-current')} aria-hidden="true" />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCompare?.(listing)}
            className={cn(
              'flex-1 min-w-0',
              isComparing && 'bg-[var(--warning)] text-white border-[var(--warning)]'
            )}
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            {isComparing ? 'Comparing' : 'Compare'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLeaseQA?.(listing)}
            className="flex-1 min-w-0"
          >
            <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
            Lease QA
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}