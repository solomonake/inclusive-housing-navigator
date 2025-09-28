'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScoreDonut } from '@/components/ui/ScoreDonut'
import { ScoreChip } from '@/components/ui/ScoreChip'
import { HeartButton } from '@/components/ui/HeartButton'
import { CompareCheckbox } from '@/components/ui/CompareCheckbox'
import { 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  FileText,
  Eye,
  Accessibility,
  Shield,
  Clock
} from 'lucide-react'
import { Listing } from '@/types'
import { cn } from '@/lib/cn'

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
    addr,
    rent,
    avg_utils,
    di_score,
    subscores
  } = listing

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalMonthlyCost = rent + (avg_utils || 0);

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-white line-clamp-2 mb-2">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{addr}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <ScoreDonut score={di_score} size="md" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {/* Price and basic info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">
                {formatPrice(rent)}
              </span>
              {avg_utils && (
                <span className="text-xs text-white/60">
                  +{formatPrice(avg_utils)} utils
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-white/60">/month</span>
          </div>
        </div>

        {/* Accessibility indicators */}
        <div className="flex flex-wrap gap-2">
          {listing.step_free && (
            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
              <Accessibility className="w-3 h-3 mr-1" />
              Step-free
            </Badge>
          )}
          {listing.elevator && (
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-300 border-blue-500/20">
              Elevator
            </Badge>
          )}
          {listing.acc_bath && (
            <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/20">
              Accessible Bath
            </Badge>
          )}
          {listing.accepts_international && (
            <Badge variant="outline" className="text-xs bg-sky-500/10 text-sky-300 border-sky-500/20">
              International OK
            </Badge>
          )}
        </div>

        {/* Distance and commute */}
        <div className="flex items-center justify-between text-sm text-white/70">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{listing.dist_to_campus_km || 1.0}km to campus</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{listing.walk_min || 15}min walk</span>
          </div>
        </div>

        {/* Score chips */}
        {subscores && (
          <div className="flex flex-wrap gap-2">
            <ScoreChip
              type="affordability"
              score={subscores.affordability}
              size="sm"
            />
            <ScoreChip
              type="accessibility"
              score={subscores.accessibility}
              size="sm"
            />
            <ScoreChip
              type="safety"
              score={subscores.safety}
              size="sm"
            />
          </div>
        )}

      </CardContent>

      <CardFooter className="pt-0 pb-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2">
            <HeartButton listingId={id} />
            <CompareCheckbox listingId={id} />
          </div>
          <Button
            variant="gradient"
            size="sm"
            onClick={() => onDetails?.(listing)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
            Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}