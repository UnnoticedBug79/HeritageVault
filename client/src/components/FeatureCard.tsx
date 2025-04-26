import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  rightIcon?: ReactNode;
  price?: string;
  metaverse?: boolean;
  link?: string;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  rightIcon,
  price,
  metaverse,
  link,
  onClick
}) => {
  const content = (
    <Card className={`feature-card neon-border bg-card hover:bg-card/80 transition-all ${onClick || link ? 'cursor-pointer' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-shrink-0">
            {icon}
          </div>
          {rightIcon && (
            <div className="flex-shrink-0 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-display font-medium mb-2">
          {title}
          {metaverse && (
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary text-xs">Beta</Badge>
          )}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-2">
          {description}
        </p>
        
        {price && (
          <div className="text-xs text-primary mt-2 font-medium">
            {price}
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  if (link) {
    return (
      <Link href={link}>
        <a>{content}</a>
      </Link>
    );
  }
  
  if (onClick) {
    return (
      <div onClick={onClick}>
        {content}
      </div>
    );
  }
  
  return content;
};

export default FeatureCard;
